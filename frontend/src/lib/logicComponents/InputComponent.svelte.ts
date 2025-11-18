import type { Coord } from "$/types";
import PrimitiveComponent from "./PrimitiveComponent.svelte";

export default class InputComponent extends PrimitiveComponent {
  constructor(name: string | null, pos: Coord) {
    super(name, pos, 2, 1, { type: "value" });
    this.addOutputPin({ side: 1, pinIndex: 0 }, "OUT");
    this.value = 0;
  }

  execute(): void {
    if (!this.value) return;
    this.outputPins[0].value = this.value;
  }
}
