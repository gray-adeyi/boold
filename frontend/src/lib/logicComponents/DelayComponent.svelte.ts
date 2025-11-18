import type { Coord } from "$/types";
import PrimitiveComponent from "./PrimitiveComponent.svelte";

export default class DelayComponent extends PrimitiveComponent {
  constructor(name: string | null, pos: Coord) {
    super(name, pos, 2, 1, { type: "icon", text: "timer" });
    this.addInputPin({ side: 3, pinIndex: 0 }, "IN");
    this.addOutputPin({ side: 1, pinIndex: 0 }, "OUT");
  }
}
