// Skier physics
export const SKIER_STANDARD_SPEED = 5;
export const SKIER_BOOST_MULTIPLIER = 2;
export const SKIER_TURN_EASE_CYCLES = 70;
export const SKIER_DEAD_ZONE_X = 75;
export const SKIER_DIRECTION_THRESHOLD_SHARP = 300;
export const SKIER_BOOST_DURATION_MS = 2000;
export const SKIER_BOOST_COOLDOWN_MS = 10000;
export const SKIER_OUCH_DURATION_MS = 600;
export const SKIER_CRASH_RECOVERY_MS = 1500;
export const SKIER_JUMP_DURATION_MS = 1000;
export const SKIER_JUMP_SPEED_BONUS = 2;
export const SKIER_TRICK_INTERVAL_MS = 300;

// Monster physics
export const MONSTER_STANDARD_SPEED = 6;
export const MONSTER_EATING_INTERVAL_MS = 300;
export const MONSTER_EATING_STAGES = 6;

// Snowboarder physics
export const SNOWBOARDER_STANDARD_SPEED = 3;

// Ski lift
export const SKI_LIFT_STANDARD_SPEED = 6;

// Game world
export const PIXELS_PER_METRE = 18;
/** Deck photo beat: finish line / yeti chase trigger (metres). */
export const FINISH_LINE_METRES = 1000;
/** How far ahead (m) to plant the finish signs so the skier can see them. */
export const FINISH_LINE_WARN_METRES = 80;
/** Random yeti spawns only after this (keep above finish so deck chase is forced). */
export const MONSTER_DISTANCE_THRESHOLD = 2000;
