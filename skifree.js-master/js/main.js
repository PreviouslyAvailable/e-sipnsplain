import Camera from './lib/camera.js';
import Monster from './lib/monster.js';
import Sprite from './lib/sprite.js';
import Snowboarder from './lib/snowboarder.js';
import Skier from './lib/skier.js';
import InfoBox from './lib/infoBox.js';
import Game from './lib/game.js';
import setupInput from './lib/input.js';
import isMobileDevice from './lib/isMobileDevice.js';
import sprites from './spriteInfo.js';
import {
	PIXELS_PER_METRE,
	MONSTER_DISTANCE_THRESHOLD,
	FINISH_LINE_METRES,
	FINISH_LINE_WARN_METRES,
} from './lib/constants.js';

const mainCanvas = document.getElementById('skifree-canvas');
const camera = Camera.create(mainCanvas.getContext('2d'));
const imageSources = ['sprite-characters.png', 'skifree-objects.png'];
const infoBoxControls = isMobileDevice()
	? 'Tap or drag on the piste to control the player'
	: 'Use the mouse or WASD to control the player';

const dropRates = { smallTree: 4, tallTree: 2, jump: 1, thickSnow: 1, rock: 1 };

/** Optional `?finishM=N` for local testing (default FINISH_LINE_METRES). */
function resolveFinishMetres() {
	try {
		const raw = new URLSearchParams(window.location.search).get('finishM');
		const n = raw == null ? NaN : Number(raw);
		if (Number.isFinite(n) && n > 0) return n;
	} catch {
		/* ignore */
	}
	return FINISH_LINE_METRES;
}

const finishMetres = resolveFinishMetres();

const state = {
	livesLeft: 5,
	highScore: Number(localStorage.getItem('highScore')) || 0,
	distanceTravelled: 0,
	finishPlaced: false,
	finishCrossed: false,
	finishYetiSpawned: false,
	/** True after the finish-line yeti catches the skier (deck Game Over beat). */
	finishCatchDone: false,
};

function postDeck(type, extra) {
	try {
		if (window.parent && window.parent !== window) {
			window.parent.postMessage(
				{ type, ...(extra || {}) },
				window.location.origin
			);
		}
	} catch {
		/* ignore */
	}
	try {
		window.dispatchEvent(new CustomEvent(type, { detail: extra || {} }));
	} catch {
		/* ignore */
	}
}

function loadImages(sources, next) {
	let loaded = 0;
	sources.forEach(src => {
		const im = new Image();
		im.onload = () => {
			loaded += 1;
			if (loaded === sources.length) next();
		};
		im.src = src;
		camera.storeLoadedImage(src, im);
	});
}

function monsterHitsSkierBehaviour(monster, skier) {
	skier.isEatenBy(monster, () => {
		state.livesLeft -= 1;
		monster.isFull = true;
		monster.isEating = false;
		skier.isBeingEaten = false;
		monster.setSpeed(skier.getSpeed());
		monster.stopFollowing();
		const randomPositionAbove = camera.getRandomMapPositionAboveViewport();
		monster.setMapPositionTarget(randomPositionAbove[0], randomPositionAbove[1]);

		// Deck beat: finish-line yeti catch → Game Over panel (photo on confirm).
		if (state.finishCrossed && !state.finishCatchDone) {
			state.finishCatchDone = true;
			postDeck('skifree-yeti', { via: 'finish' });
			postDeck('skifree-gameover', { via: 'yeti' });
			try {
				window.__skifreeShowGameOver?.();
			} catch {
				/* ignore */
			}
		} else {
			postDeck('skifree-yeti', { via: 'random' });
		}
	});
}

function startNeverEndingGame() {
	let player;
	let startSign;
	let infoBox;
	let game;
	/** @type {Sprite[]} */
	let finishSigns = [];

	function resetDeckBeatFlags() {
		state.finishPlaced = false;
		state.finishCrossed = false;
		state.finishYetiSpawned = false;
		state.finishCatchDone = false;
		finishSigns = [];
		try {
			window.__skifreeHideGameOver?.();
		} catch {
			/* ignore */
		}
	}

	function resetGame() {
		state.distanceTravelled = 0;
		state.livesLeft = 5;
		state.highScore = Number(localStorage.getItem('highScore')) || 0;
		resetDeckBeatFlags();
		game.reset();
		game.addStaticObject(startSign);
	}

	function detectEnd() {
		if (!game.isPaused()) {
			localStorage.setItem('highScore', state.distanceTravelled);
			state.highScore = state.distanceTravelled;
			infoBox.setLines([
				'Game over!',
				'Hit space to restart',
			]);
			game.pause();
			game.cycle();
			game.draw();
		}
	}

	function placeFinishLine() {
		if (state.finishPlaced) return;
		state.finishPlaced = true;
		const metresLeft = Math.max(finishMetres - Number(state.distanceTravelled), 8);
		const finishY = player.mapPosition[1] + metresLeft * PIXELS_PER_METRE;
		const centreX = player.mapPosition[0];
		// Row of start signs reads as a finish gate across the piste.
		const offsets = [-90, -45, 0, 45, 90];
		finishSigns = offsets.map((dx) => {
			const sign = new Sprite(sprites.signStart);
			sign.setMapPosition(centreX + dx, finishY);
			game.addStaticObject(sign);
			return sign;
		});
		postDeck('skifree-finish', {
			metres: Number(state.distanceTravelled),
			target: finishMetres,
			phase: 'placed',
		});
	}

	function spawnMonster() {
		const newMonster = new Monster(sprites.monster);
		const randomPosition = camera.getRandomMapPositionAboveViewport();
		newMonster.setMapPosition(randomPosition[0], randomPosition[1]);
		newMonster.follow(player);
		newMonster.setSpeed(player.getStandardSpeed());
		newMonster.onHitting(player, monsterHitsSkierBehaviour);
		game.addMovingObject(newMonster, 'monster');
	}

	/** Force-spawn a chasing yeti at the finish so the catch scene always plays. */
	function spawnFinishYeti() {
		if (state.finishYetiSpawned) return;
		state.finishYetiSpawned = true;
		const newMonster = new Monster(sprites.monster);
		const px = player.mapPosition[0];
		const py = player.mapPosition[1];
		// Spawn just uphill / above so the chase is immediate and visible.
		newMonster.setMapPosition(px + 40, py - 120);
		newMonster.follow(player);
		newMonster.setSpeed(Math.max(player.getStandardSpeed() + 2, 7));
		newMonster.onHitting(player, monsterHitsSkierBehaviour);
		game.addMovingObject(newMonster, 'monster');
		postDeck('skifree-finish', {
			metres: Number(state.distanceTravelled),
			target: finishMetres,
			phase: 'crossed',
		});
	}

	function spawnBoarder() {
		const newBoarder = new Snowboarder(sprites.snowboarder);
		const randomPositionAbove = camera.getRandomMapPositionAboveViewport();
		const randomPositionBelow = camera.getRandomMapPositionBelowViewport();
		newBoarder.setMapPosition(randomPositionAbove[0], randomPositionAbove[1]);
		newBoarder.setMapPositionTarget(randomPositionBelow[0], randomPositionBelow[1]);
		newBoarder.onHitting(player, sprites.snowboarder.hitBehaviour.skier);
		game.addMovingObject(newBoarder);
	}

	function randomlySpawnNPC(spawnFunction, dropRate) {
		const rateModifier = Math.max(800 - camera.logicalWidth(), 0);
		if (Math.floor(Math.random() * (1001 + rateModifier)) <= dropRate) {
			spawnFunction();
		}
	}

	function spawnTerrain() {
		if (!player.isMoving) return [];
		return Sprite.createObjects([
			{ sprite: sprites.smallTree, dropRate: dropRates.smallTree },
			{ sprite: sprites.tallTree, dropRate: dropRates.tallTree },
			{ sprite: sprites.jump, dropRate: dropRates.jump },
			{ sprite: sprites.thickSnow, dropRate: dropRates.thickSnow },
			{ sprite: sprites.rock, dropRate: dropRates.rock },
		], {
			rateModifier: Math.max(800 - camera.logicalWidth(), 0),
			position: () => camera.getRandomMapPositionBelowViewport(),
			player,
		});
	}

	function tickNPCs() {
		randomlySpawnNPC(spawnBoarder, 0.1);
		state.distanceTravelled = parseFloat(player.getPixelsTravelledDownMountain() / PIXELS_PER_METRE).toFixed(1);
		const metres = Number(state.distanceTravelled);
		// Keep warn window inside [0, finish) so short ?finishM=N tests still work.
		const warnM = Math.min(
			FINISH_LINE_WARN_METRES,
			Math.max(finishMetres * 0.5, 5)
		);

		if (!state.finishPlaced && metres >= finishMetres - warnM) {
			placeFinishLine();
		}

		if (!state.finishCrossed && metres >= finishMetres) {
			state.finishCrossed = true;
			spawnFinishYeti();
		}

		// Classic random yetis only well after the deck finish beat.
		if (metres > MONSTER_DISTANCE_THRESHOLD) {
			randomlySpawnNPC(spawnMonster, 0.001);
		}
	}

	function updateHUD() {
		const lines = [
			'SkiFree.js',
			infoBoxControls,
			`Travelled ${state.distanceTravelled}m`,
			`Skiers left: ${state.livesLeft}`,
			`High Score: ${state.highScore}`,
			'Created by Dan Hough (@basicallydan)',
			`Current Speed: ${player.getSpeed()}`,
		];
		if (state.finishPlaced && !state.finishCrossed) {
			lines.splice(3, 0, `Finish @ ${finishMetres}m`);
		} else if (state.finishCrossed && !state.finishCatchDone) {
			lines.splice(3, 0, 'Yeti!');
		} else if (state.finishCatchDone) {
			lines.splice(3, 0, 'Game Over — confirm for photo');
		}
		infoBox.setLines(lines);
	}

	player = new Skier(sprites.skier);
	player.setMapPosition(0, 0);
	player.setMapPositionTarget(0, -10);

	game = new Game(camera, player);

	startSign = new Sprite(sprites.signStart);
	game.addStaticObject(startSign);
	startSign.setMapPosition(-50, 0);

	infoBox = new InfoBox({
		initialLines: [
			'SkiFree.js',
			infoBoxControls,
			'Travelled 0m',
			`High Score: ${state.highScore}`,
			`Skiers left: ${state.livesLeft}`,
			'Created by Dan Hough (@basicallydan)',
		],
		position: { top: 15, right: 10 },
	});

	game.beforeCycle(() => {
		game.addStaticObjects(spawnTerrain());
		if (!game.isPaused()) {
			tickNPCs();
			updateHUD();
		}
	});

	game.afterCycle(() => {
		// Finish-line catch uses the Game Over panel; classic wipeout still pauses.
		if (state.finishCatchDone) {
			if (!game.isPaused()) {
				infoBox.setLines([
					'Game over!',
					'Yeti got you at the finish',
					'Confirm Game Over for photo',
					'Or Space to restart',
				]);
				game.pause();
				game.cycle();
				game.draw();
			}
			return;
		}
		if (state.livesLeft === 0) detectEnd();
	});

	game.addUIElement(infoBox);

	setupInput({ player, game, canvas: mainCanvas, spawnMonster, spawnBoarder, resetGame });

	player.isMoving = false;
	player.setDirection(270);

	game.start();
}

function resizeCanvas() {
	const dpr = window.devicePixelRatio || 1;
	// Set CSS size to logical pixels, backing store to physical pixels.
	// All game coordinates remain in logical pixels; the scale() call below
	// handles the mapping so every draw lands on a real screen pixel.
	mainCanvas.style.width = `${window.innerWidth}px`;
	mainCanvas.style.height = `${window.innerHeight}px`;
	mainCanvas.width = Math.round(window.innerWidth * dpr);
	mainCanvas.height = Math.round(window.innerHeight * dpr);
	// canvas resize resets the context, so re-apply the scale and crispness.
	camera.scale(dpr, dpr);
	camera.imageSmoothingEnabled = false;
}

window.addEventListener('resize', resizeCanvas, false);

resizeCanvas();
loadImages(imageSources, startNeverEndingGame);
