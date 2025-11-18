import type PrimitiveComponent from "./lib/logicComponents/PrimitiveComponent.svelte";
import type Wire from "./lib/logicComponents/Wire.svelte";

export type Coord = {
  x: number;
  y: number;
}

export type RGBColor = {
  r: number;
  g: number;
  b: number;
}

export type ComponentIcon = {
  type: "icon" | "char";
  text: string;
} | {type: "value"}

export type ComponentProperties = {
  delay?: number
}

export type ComponentPortPlacement = {
  side: number;
  coord: number; // x or y
}

export type ComponentPort = ComponentProperties & {
  readonly id: string;
  readonly type: "input" | "output";
  component: PrimitiveComponent;
  name: string;
  readonly placement: ComponentPortPlacement; // alias for pos
  value: number;
  connection?: Wire;
}