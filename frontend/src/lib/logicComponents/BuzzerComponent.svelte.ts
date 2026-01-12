import type { Coord } from "$/types";
import { buzz } from "$/lib/audio";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";

export default class BuzzerComponent extends PrimitiveComponent {
  constructor(name: string | null, pos: Coord, boardStoreState: BoardStoreState) {
    super(name, pos, 2, 1, { type: "icon", text: "audiotrack" }, boardStoreState);
    this.addInputPin({ side: 3, sideIndex: 0 }, "IN");
    this.properties.frequency = 700;
    this.properties.duration = 200;
  }

  execute(): void {
    if (
      this.inputPins[0].value === 1 &&
      this.properties.frequency &&
      this.properties.duration &&
      this.boardStoreState.audioCtx
    ) {
      buzz(this.boardStoreState.audioCtx, this.properties.frequency, this.properties.duration);
    }
  }
}
