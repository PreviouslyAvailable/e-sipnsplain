/**
 * Timewarp timeline — games that filled the marketing / design lens (2009–2025).
 * Image paths: drop files under assets/timewarp/ then set `image` (see README).
 * Until then, cards render a labeled placeholder from iconic_artifact / search_lead.
 */

/**
 * @typedef {"Design-led" | "Campaign-led"} TimewarpLens
 * @typedef {{
 *   id: string,
 *   timeline_year: number,
 *   game: string,
 *   developer: string,
 *   actual_release: string,
 *   the_moment: string,
 *   why_it_landed: string,
 *   iconic_artifact: string,
 *   artifact_type: string,
 *   search_lead: string,
 *   lens: TimewarpLens,
 *   source_url: string,
 *   source_note: string,
 *   image?: string,
 *   icon?: string,
 * }} TimewarpItem
 */

/** Dock / home-bar app icon for a timeline game (defaults to assets/timewarp/icons/{id}.png). */
export function timewarpIconSrc(item) {
  if (item?.icon) return item.icon;
  if (item?.id) return `/assets/timewarp/icons/${item.id}.png`;
  return "";
}

/** @type {TimewarpItem[]} */
export const TIMEWARP_ITEMS = [
  {
    id: "farmville",
    timeline_year: 2009,
    game: "FarmVille",
    developer: "Zynga",
    actual_release: "2009",
    the_moment:
      "FarmVille took over Facebook, and suddenly relatives who had never played a game were farming and spamming everyone's feed with crop requests.",
    why_it_landed:
      "First time gaming went truly mainstream through a social network. The shared memory is the feed spam, not the game.",
    iconic_artifact:
      "A Facebook feed clogged with FarmVille requests, or the classic isometric farm-plot screenshot",
    artifact_type: "Game screengrab / feed screenshot",
    search_lead:
      "FarmVille facebook feed requests screenshot; FarmVille farm gameplay 2009",
    lens: "Design-led",
    source_url:
      "https://www.nbcnews.com/tech/tech-news/zynga-woos-back-lapsed-facebook-farmers-farmville-2-flna980599",
    source_note:
      "FarmVille at its Facebook peak, with player numbers and the feed-request phenomenon (NBC News).",
    image: "/assets/timewarp/farmville.jpg",
  },
  {
    id: "angry-birds",
    timeline_year: 2010,
    game: "Angry Birds",
    developer: "Rovio",
    actual_release: "Dec 2009, boom in 2010",
    the_moment:
      "The first game the whole family played, then a merchandising empire of plush toys, a movie and theme parks.",
    why_it_landed:
      "A mobile game became a global character brand. The birds were everywhere, on shelves as much as on screens.",
    iconic_artifact:
      "The red bird / slingshot key art, or a shop wall stacked with Angry Birds plush toys",
    artifact_type: "Key art / real-world photo",
    search_lead:
      "Angry Birds red bird key art; Angry Birds plush merchandise store",
    lens: "Campaign-led",
    source_url:
      "https://digitalagencynetwork.com/best-video-game-marketing-campaigns/",
    source_note:
      "Angry Birds x McDonald's Happy Meal crossover and other campaign creative (Digital Agency Network). For poster work see Communication Arts 'Angry Birds poster'.",
    image: "/assets/timewarp/angry-birds.jpg",
  },
  {
    id: "temple-run",
    timeline_year: 2011,
    game: "Temple Run",
    developer: "Imangi Studios",
    actual_release: "2011",
    the_moment:
      "The endless runner that was on every phone, played under the desk at school and in every waiting room.",
    why_it_landed:
      "Defined the swipe-to-run mobile genre and pure pick-up-and-play ubiquity.",
    iconic_artifact:
      "Gameplay screenshot of the explorer sprinting the ruins with the demon monkeys behind",
    artifact_type: "Game screengrab",
    search_lead: "Temple Run gameplay screenshot running",
    lens: "Design-led",
    source_url: "https://techcrunch.com/2012/01/15/temple-run/",
    source_note:
      "How evil monkeys chased Temple Run to App Store #1, with gameplay art (TechCrunch).",
    image: "/assets/timewarp/temple-run.jpg",
  },
  {
    id: "subway-surfers",
    timeline_year: 2012,
    game: "Subway Surfers",
    developer: "SYBO Games / Kiloo",
    actual_release: "2012",
    the_moment:
      "Everyone's phone had it, and years later it got a second life as the split-screen background footage under TikToks.",
    why_it_landed:
      "Longevity and its accidental role as attention-holding filler made it one of the most recognisable mobile games ever.",
    iconic_artifact:
      "Gameplay screenshot of the character running the tracks, or the TikTok split-screen format",
    artifact_type: "Game screengrab",
    search_lead:
      "Subway Surfers gameplay screenshot; Subway Surfers tiktok split screen",
    lens: "Design-led",
    source_url:
      "https://kotaku.com/subway-surfers-tiktok-corecore-video-collage-psychology-1850061976",
    source_note:
      "Why Subway Surfers footage became TikTok background 'brainrot' (Kotaku).",
    image: "/assets/timewarp/subway-surfers.jpg",
  },
  {
    id: "geoguessr",
    timeline_year: 2013,
    game: "GeoGuessr",
    developer: "Anton Wallén (GeoGuessr AB)",
    actual_release: "2013",
    the_moment:
      "Guess where you are from a Street View image. It grew through streamers, later spawning pros who could name a country from a patch of dirt.",
    why_it_landed:
      "A pure browser concept with no marketing that became a streamer and competitive staple.",
    iconic_artifact:
      "The GeoGuessr interface: a Street View shot with the world-map guess pin",
    artifact_type: "Game screengrab",
    search_lead: "GeoGuessr interface street view world map guess",
    lens: "Design-led",
    source_url:
      "https://melmagazine.com/en-us/story/geoguessr-georainbolt-trevor-rainbolt-google-street-view",
    source_note:
      "GeoGuessr's rise via Rainbolt and streamers, with the Street View interface (MEL Magazine).",
    image: "/assets/timewarp/geoguessr.jpg",
  },
  {
    id: "flappy-bird",
    timeline_year: 2014,
    game: "Flappy Bird",
    developer: "Dong Nguyen (dotGEARS)",
    actual_release: "2013, viral early 2014, pulled Feb 2014",
    the_moment:
      "Overnight global addiction — then the creator yanked it with one apology tweet.",
    why_it_landed:
      "Addictive one-tap loop plus the public takedown as the cultural climax: Dong Nguyen's apology tweet announcing he'd remove the game.",
    iconic_artifact:
      "Dong Nguyen's Twitter apology announcing he'd take Flappy Bird down",
    artifact_type: "Tweet screenshot / news artifact",
    search_lead: "Flappy Bird Dong Nguyen tweet take down 2014",
    lens: "Design-led",
    source_url:
      "https://www.theverge.com/2014/2/8/5392888/flappy-bird-being-pulled-from-app-stores",
    source_note:
      "Feb 2014: Dong Nguyen announces he'll pull Flappy Bird from the App Store after its viral peak (The Verge).",
    image: "/assets/timewarp/flappy-bird.png",
  },
  {
    id: "rocket-league",
    timeline_year: 2015,
    game: "Rocket League",
    developer: "Psyonix",
    actual_release: "2015",
    the_moment:
      "Cars playing football. It was free on PS Plus at launch, blew up overnight and became a genuine esport.",
    why_it_landed:
      "A ridiculous, instantly readable premise plus a giveaway launch created a massive, lasting community.",
    iconic_artifact:
      "Match key art of cars mid-air striking the giant ball, or an esports arena shot",
    artifact_type: "Key art / esports photo",
    search_lead: "Rocket League key art; Rocket League esports arena",
    lens: "Campaign-led",
    source_url: "https://www.inverse.com/gaming/rocket-league-10-year-anniversary",
    source_note:
      "Rocket League's free PS Plus launch and rise, 10-year retrospective (Inverse).",
    image: "/assets/timewarp/rocket-league.jpg",
  },
  {
    id: "pokemon-go",
    timeline_year: 2016,
    game: "Pokémon GO",
    developer: "Niantic (with The Pokémon Company / Nintendo)",
    actual_release: "2016",
    the_moment:
      "People physically flooded parks and streets chasing Pokémon. Crowds stampeded through Central Park for a rare spawn and it led every news bulletin.",
    why_it_landed:
      "It pulled millions of people off the couch and into the real world at once. The strongest 'moment' image on the whole list.",
    iconic_artifact:
      "News photo of a huge crowd in a park or street, all on their phones chasing a spawn",
    artifact_type: "News photo",
    search_lead:
      "Pokemon GO crowd Central Park Vaporeon 2016; Pokemon GO crowd street news",
    lens: "Campaign-led",
    source_url:
      "https://www.nbcnewyork.com/news/local/pokemon-go-players-stampede-new-york-central-park/642115/",
    source_note:
      "The Central Park Vaporeon stampede, the definitive crowd moment (NBC New York). For an ad angle instead, see the Team Go Rocket OOH 'hack' campaign at Marketing Dive.",
    image: "/assets/timewarp/pokemon-go.jpg",
  },
  {
    id: "stardew-valley",
    timeline_year: 2017,
    game: "Stardew Valley",
    developer: "ConcernedApe (Eric Barone)",
    actual_release: "2016 PC, Switch Oct 2017",
    the_moment:
      "A cosy farming sim built almost entirely by one person quietly won everyone over as the anti-blockbuster.",
    why_it_landed:
      "No marketing, no studio. Its warm pixel-art world and gentle design did all the work by word of mouth.",
    iconic_artifact:
      "A Stardew Valley farm screenshot showing off the pixel-art style",
    artifact_type: "Game screengrab",
    search_lead: "Stardew Valley farm gameplay screenshot pixel art",
    lens: "Design-led",
    source_url:
      "https://www.inc.com/ben-sherry/with-stardew-valley-eric-barone-makes-entrepreneurship-enchanting-his-own-business-isnt-his-concern.html",
    source_note:
      "Solo dev Eric Barone profile with Stardew's pixel-art world (Inc.).",
    image: "/assets/timewarp/stardew-valley.jpg",
  },
  {
    id: "fortnite",
    timeline_year: 2018,
    game: "Fortnite",
    developer: "Epic Games",
    actual_release: "BR mode Sept 2017, peak 2018",
    the_moment:
      "The game leaked into everything. Footballers celebrated World Cup goals with Fortnite dances and every kid was doing the Floss.",
    why_it_landed:
      "It stopped being a game and became a shared language, dances and all, that even non-players recognised.",
    iconic_artifact:
      "A footballer doing a Fortnite dance celebration at the 2018 World Cup, or a kid doing the Floss",
    artifact_type: "Real-world / news photo",
    search_lead:
      "Fortnite dance World Cup 2018 celebration; Floss dance Fortnite",
    lens: "Campaign-led",
    source_url:
      "https://www.pcgamer.com/fortnite-dance-appears-at-world-cup-2018-final/",
    source_note:
      "Griezmann's 'Take the L' Fortnite dance at the World Cup final (PC Gamer). For ad creative instead, see the Balenciaga x Fortnite 3D billboard at The Drum.",
    image: "/assets/timewarp/fortnite.png",
  },
  {
    id: "untitled-goose-game",
    timeline_year: 2019,
    game: "Untitled Goose Game",
    developer: "House House",
    actual_release: "2019",
    the_moment:
      "The whole internet fell for a horrible goose. Goose memes were everywhere for months.",
    why_it_landed:
      "A tiny indie went viral on pure charm and a great one-line concept, no paid push at all.",
    iconic_artifact:
      "Key art of the goose with a stolen item (glasses or the bell), or a goose meme",
    artifact_type: "Key art / meme",
    search_lead: "Untitled Goose Game key art goose; horrible goose meme",
    lens: "Design-led",
    source_url:
      "https://www.pcgamer.com/the-internet-has-honked-out-a-ton-of-untitled-goose-game-memes-and-art/",
    source_note:
      "Untitled Goose Game memes and fan art round-up (PC Gamer).",
    image: "/assets/timewarp/untitled-goose-game.jpg",
  },
  {
    id: "among-us",
    timeline_year: 2020,
    game: "Among Us",
    developer: "InnerSloth",
    actual_release: "2018, viral in 2020",
    the_moment:
      "A 2018 game exploded in lockdown. A US congresswoman streamed it to one of Twitch's biggest-ever audiences, and 'sus' entered everyday speech.",
    why_it_landed:
      "It jumped from a game to the culture, becoming both a meme and a mainstream news story.",
    iconic_artifact:
      "A screenshot of the AOC Among Us Twitch stream, or the crewmate 'sus' meme",
    artifact_type: "Stream screenshot / meme",
    search_lead:
      "AOC Among Us twitch stream 2020; Among Us crewmate sus meme",
    lens: "Design-led",
    source_url:
      "https://techcrunch.com/2020/10/21/aocs-among-us-stream-topped-435000-concurrent-viewers/",
    source_note:
      "AOC's record-breaking Among Us Twitch stream (TechCrunch).",
    image: "/assets/timewarp/among-us.jpg",
  },
  {
    id: "fall-guys",
    timeline_year: 2021,
    game: "Fall Guys",
    developer: "Mediatonic",
    actual_release: "2020",
    the_moment:
      "The chaotic bean battle-royale party game that took over streams, then filled itself with brand-collab costumes.",
    why_it_landed:
      "Bright, funny and endlessly clippable, with a mascot look that turned into a licensable brand.",
    iconic_artifact:
      "Colourful key art of the beans tumbling through an obstacle course",
    artifact_type: "Key art",
    search_lead: "Fall Guys key art beans obstacle course",
    lens: "Campaign-led",
    source_url:
      "https://www.playstationlifestyle.net/2021/09/24/fall-guys-guinness-world-records-most-downloaded-playstation-plus-game/",
    source_note:
      "Fall Guys as most-downloaded PS Plus game, plus its brand crossovers (PlayStation Lifestyle).",
    image: "/assets/timewarp/fall-guys.jpg",
  },
  {
    id: "wordle",
    timeline_year: 2022,
    game: "Wordle",
    developer: "Josh Wardle (later The New York Times)",
    actual_release: "Oct 2021, viral Jan 2022",
    the_moment:
      "Feeds filled every morning with grids of green and yellow squares, then the New York Times bought it for a reported seven figures.",
    why_it_landed:
      "One puzzle a day, shared by a spoiler-free result grid. The grid itself was the whole phenomenon.",
    iconic_artifact:
      "A social feed full of the green-and-yellow square result grids",
    artifact_type: "Meme / screengrab",
    search_lead: "Wordle result grid green yellow squares twitter",
    lens: "Design-led",
    source_url:
      "https://www.digitaltrends.com/gaming/wordle-2022-year-end-interview/",
    source_note:
      "Wordle's wild 2022, the share grid and NYT acquisition (Digital Trends).",
    image: "/assets/timewarp/wordle.png",
  },
  {
    id: "zelda-totk",
    timeline_year: 2023,
    game: "The Legend of Zelda: Tears of the Kingdom",
    developer: "Nintendo",
    actual_release: "2023",
    the_moment:
      "A giant launch, then the community moment: players sharing absurd contraptions and vehicles built with the Ultrahand tool.",
    why_it_landed:
      "The build system turned every player into an engineer and the clips into their own viral genre.",
    iconic_artifact:
      "A screenshot of a ridiculous player-built machine, or the official key art",
    artifact_type: "Game screengrab / key art",
    search_lead:
      "Tears of the Kingdom Ultrahand build contraption; Zelda TOTK key art",
    lens: "Campaign-led",
    source_url:
      "https://www.gamesradar.com/zelda-leads-were-blown-away-by-what-tears-of-the-kingdom-players-made-with-ultrahand-its-beyond-even-the-development-teams-imagination/",
    source_note:
      "Nintendo's devs on the wild Ultrahand builds players shared (GamesRadar).",
    image: "/assets/timewarp/zelda-totk.jpg",
  },
  {
    id: "balatro",
    timeline_year: 2024,
    game: "Balatro",
    developer: "LocalThunk (published by Playstack)",
    actual_release: "2024",
    the_moment:
      "The poker roguelike that ate everyone's time. 'Just one more run' became the whole discourse.",
    why_it_landed:
      "A hypnotic loop and a retro CRT card aesthetic made it the breakout indie of the year, spread by streamers.",
    iconic_artifact:
      "A Balatro gameplay screenshot showing the jokers and the CRT card look",
    artifact_type: "Game screengrab",
    search_lead: "Balatro gameplay screenshot jokers CRT",
    lens: "Design-led",
    source_url:
      "https://www.rollingstone.com/culture/rs-gaming/balatro-localthunk-interview-1235214060/",
    source_note:
      "LocalThunk on making 2024's breakout game (Rolling Stone). Sales-milestone coverage at PCGamesN.",
    image: "/assets/timewarp/balatro.jpg",
  },
  {
    id: "mario-kart-world",
    timeline_year: 2025,
    game: "Mario Kart World",
    developer: "Nintendo",
    actual_release: "2025",
    the_moment:
      "The flagship launch title for the Nintendo Switch 2, at the centre of the year's biggest hardware moment.",
    why_it_landed:
      "A new Mario Kart plus a new console generation is about as broad a gaming moment as it gets.",
    iconic_artifact:
      "Mario Kart World key art, or a Switch 2 launch-day / launch-window image",
    artifact_type: "Key art / launch photo",
    search_lead: "Mario Kart World key art; Nintendo Switch 2 launch",
    lens: "Campaign-led",
    source_url:
      "https://variety.com/2025/gaming/news/nintendo-switch-2-release-date-mario-kart-world-1236353845/",
    source_note: "Switch 2 and Mario Kart World launch reveal (Variety).",
    image: "/assets/timewarp/mario-kart-world.jpg",
  }
];

/** Suggested drop path: /assets/timewarp/{id}.jpg|png|webp */
export function timewarpImagePath(id, ext = "png") {
  return `/assets/timewarp/${id}.${ext}`;
}
