import type { Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";

export default class ConstantComponent extends PrimitiveComponent {
  constructor(name: string | null, pos: Coord, value: number = 0) {
    super(name, pos, 2, 1, { type: "value" });
    this.addOutputPin({ side: 1, pinIndex: 0 }, "OUT");
    this.value = value;
  }

  execute(): void {
    if (this.value === null) return;
    this.outputPins[0].value = this.value;
  }
}
