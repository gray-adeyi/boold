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
  delay?: number;
  frequency?: number;
  duration?: number;
  data?: unknown;
  addressWidth?: unknown;
  rom?: number[];
}

export type ComponentPinPlacement = {
  side: number;
  pinIndex: number;
}

export type ComponentPin = ComponentProperties & {
  readonly id: string;
  readonly type: "input" | "output";
  component: PrimitiveComponent;
  name: string;
  placement: ComponentPinPlacement; // alias for pos
  value: number;
  connection?: Wire;
}