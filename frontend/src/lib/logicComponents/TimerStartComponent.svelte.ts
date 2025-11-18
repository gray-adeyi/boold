import type { Coord } from "$/types";
import PrimitiveComponent from "./PrimitiveComponent.svelte";
import { state as workspaceStoreState } from "$/stores/workspaceStore.svelte";

export default class TimerStartComponent extends PrimitiveComponent {
  constructor(name: string | null, pos: Coord) {
    super(name, pos, 2, 1, { type: "value" });
    this.value = 0;
  }

  update() {
    console.time();
    workspaceStoreState.timerStart = new Date();
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
