import type { Coord } from "$/types";
import PrimitiveComponent from "./PrimitiveComponent.svelte";
import { state as boardStoreState, type BoardStoreState } from "$/stores/boardStore.svelte";
import type ClickableComponent from "$/lib/logicComponents/ClickableComponent";

export default class TimerStartComponent extends PrimitiveComponent implements ClickableComponent {
  constructor(name: string | null, pos: Coord, boardStoreState: BoardStoreState) {
    super(name, pos, 2, 1, { type: "value" }, boardStoreState);
    this.addOutputPin({ side: 1, sideIndex: 0 }, "OUT");
    this.value = 0;
  }

  handleClick(): void {
    this.value = 1 - (this.value || 0);
    this.update();
  }

  update() {
    console.time();
    boardStoreState.timerStart = new Date();
    this.execute();
    if (!this.value) return;
    this.outputPins[0].value = this.value;

    if (this.outputPins[0].connection) {
      this.outputPins[0].connection.update(this.value);
    }
  }

  execute(): void {
    if (!this.value) return;
    this.outputPins[0].value = this.value;
  }
}
