import type { Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";

export default class OutputComponent extends PrimitiveComponent {
  constructor(name: string | null, pos: Coord, boardStoreState: BoardStoreState) {
    super(name, pos, 2, 1, { type: "value" }, boardStoreState);
    this.addInputPin({ side: 3, sideIndex: 0 }, "IN");
    this.value = 0;
  }

  execute(): void {
    this.value = this.inputPins[0].value;
  }
}
