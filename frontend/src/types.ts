import type BeepComponent from "$/lib/logicComponents/BeepComponent.svelte";
import type ButtonComponent from "$/lib/logicComponents/ButtonComponent.svelte";
import type ClockComponent from "$/lib/logicComponents/ClockComponent.svelte";
import type ConstantComponent from "$/lib/logicComponents/ConstantComponent.svelte";
import type CounterComponent from "$/lib/logicComponents/CounterComponent.svelte";
import type CustomComponent from "$/lib/logicComponents/CustomComponent.svelte";
import type DebugComponent from "$/lib/logicComponents/DebugComponent.svelte";
import type DelayComponent from "$/lib/logicComponents/DelayComponent.svelte";
import type DisplayComponent from "$/lib/logicComponents/DisplayComponent.svelte";
import type InputComponent from "$/lib/logicComponents/InputComponent.svelte";
import type LEDComponent from "$/lib/logicComponents/LEDComponent.svelte";
import type NOTGateComponent from "$/lib/logicComponents/NOTGateComponent.svelte";
import type ORGateComponent from "$/lib/logicComponents/ORGateComponent.svelte";
import type OutputComponent from "$/lib/logicComponents/OutputComponent.svelte";
import type ROMComponent from "$/lib/logicComponents/ROMComponent.svelte";
import type TimerEndComponent from "$/lib/logicComponents/TimerEndComponent.svelte";
import type TimerStartComponent from "$/lib/logicComponents/TimerStartComponent.svelte";
import type Wire from "$/lib/logicComponents/Wire.svelte";
import type XORGateComponent from "$/lib/logicComponents/XORGateComponent.svelte";

export interface LogicComponent {
  // updates the component for every simulation frame
  update(): void;
  // draws the component to the canvas
  draw(): void;
  // applies the logical functionality of the component
  execute(): void;
  // change the orientation of the component if it has not be connected
  // to other components
  rotate(): void;
}

export type UserSelection = {
  pos: Coord;
  dimension: {
    width: number;
    height: number;
  };
  components: AnyLogicComponent[];
  wires: Wire[];
  dashOffset: number;
};

export type Coord = {
  x: number;
  y: number;
};

export type RGBColor = {
  r: number;
  g: number;
  b: number;
};

export type ComponentIcon =
  | {
      type: "icon" | "char";
      text: string;
    }
  | { type: "value" };

export type ComponentProperties = {
  delay?: number;
  frequency?: number;
  duration?: number;
  data?: unknown;
  addressWidth?: unknown;
  rom?: number[];
};

export type ComponentPinPlacement = {
  side: number;
  /**
   * sideIndex is the index of the pin on that side of the component
   * e.g. if a componentPin has a side=3 (i.e. the pin is on the left
   * side of the component), a sideIndex of 0 indicates that the pin
   * is the first pin on that side of the component.
   */
  sideIndex: number;
};

type BaseComponentPin = ComponentProperties & {
  readonly id: string;
  readonly type: "input" | "output";
  component: AnyLogicComponent;
  name: string;
  placement: ComponentPinPlacement; // alias for pos
  value: number;
  connection?: Wire;
};

export type ComponentInputPin = BaseComponentPin & {
  readonly type: "input";
};

export type ComponentOutputPin = BaseComponentPin & {
  readonly type: "output";
};

export type ComponentPin = ComponentInputPin | ComponentOutputPin;

export type AnyLogicComponent =
  | BeepComponent
  | ButtonComponent
  | ClockComponent
  | ConstantComponent
  | CounterComponent
  | CustomComponent
  | DebugComponent
  | DelayComponent
  | DisplayComponent
  | InputComponent
  | LEDComponent
  | NOTGateComponent
  | ORGateComponent
  | OutputComponent
  | ROMComponent
  | TimerEndComponent
  | TimerStartComponent
  | XORGateComponent;

export type AnyLogicComponentClass =
  | typeof BeepComponent
  | typeof ButtonComponent
  | typeof ClockComponent
  | typeof ConstantComponent
  | typeof CounterComponent
  | typeof CustomComponent
  | typeof DebugComponent
  | typeof DelayComponent
  | typeof DisplayComponent
  | typeof InputComponent
  | typeof LEDComponent
  | typeof NOTGateComponent
  | typeof ORGateComponent
  | typeof OutputComponent
  | typeof ROMComponent
  | typeof TimerEndComponent
  | typeof TimerStartComponent
  | typeof XORGateComponent;

export type BoardEntity = AnyLogicComponent | ComponentPin | Wire;

export type WireIntersection = { pos: Coord; type: number };

export type FloatingMenuOption = {
  icon: string;
  display: string;
  shortcut?: string;
  action: () => void;
};
