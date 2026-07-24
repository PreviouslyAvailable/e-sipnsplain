// PS2UI — the PlayStation 2 system dashboard, as a web UI kit.
// Import the stylesheet once in your app: `import "ps2ui/styles.css"`.

// Design tokens (typed mirror of the CSS variables)
export * from "./tokens";

// Environment / system
export { PS2Provider, usePS2 } from "./system/environment";
export type { PS2ProviderProps } from "./system/environment";
export type { BaseProps, Scene, Region } from "./system/types";

// Components
export { Text } from "./components/Text";
export type { TextProps } from "./components/Text";
export { Surface } from "./components/Surface";
export type { SurfaceProps } from "./components/Surface";
export { Panel } from "./components/Panel";
export type { PanelProps } from "./components/Panel";
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";
export { Cube } from "./components/Cube";
export type { CubeProps } from "./components/Cube";
export { IconTile } from "./components/IconTile";
export type { IconTileProps } from "./components/IconTile";
export { List, Row } from "./components/List";
export type { ListProps, RowProps } from "./components/List";
export { Clock } from "./components/Clock";
export type { ClockProps } from "./components/Clock";
export { Progress } from "./components/Progress";
export type { ProgressProps } from "./components/Progress";
export { AmbientBackground } from "./components/AmbientBackground";
export type { AmbientBackgroundProps } from "./components/AmbientBackground";
export { BootScreen } from "./components/BootScreen";
export type { BootScreenProps } from "./components/BootScreen";

// Composed blocks
export * from "./blocks";
