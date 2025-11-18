import type { Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";

export default class DisplayComponent extends PrimitiveComponent {
  private lineWidth: number;
  private hOffset: number;
  private colorOff: string;
  private colorOn: string;
  constructor(name: string | null, pos: Coord, color = "#a00") {
    super(name, pos, 4, 5, { type: "value" });
    this.addInputPin({ side: 0, pinIndex: 0 }, "A");
    this.addInputPin({ side: 0, pinIndex: 1 }, "B");
    this.addInputPin({ side: 0, pinIndex: 2 }, "C");
    this.addInputPin({ side: 0, pinIndex: 3 }, "D");
    this.addInputPin({ side: 2, pinIndex: 0 }, "E");
    this.addInputPin({ side: 2, pinIndex: 1 }, "F");
    this.addInputPin({ side: 2, pinIndex: 2 }, "G");
    this.addInputPin({ side: 2, pinIndex: 3 }, "DP");
    this.value = 0;

    this.lineWidth = 0.12;
    this.hOffset = this.width / 8;
    this.colorOff = "#300";
    this.colorOn = "#f00";
  }
}
