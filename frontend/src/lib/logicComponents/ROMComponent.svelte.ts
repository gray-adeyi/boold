import type { Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";

export default class ROMComponent extends PrimitiveComponent {
  constructor(name: string | null, pos: Coord, boardStoreState: BoardStoreState, data = []) {
    super(name, pos, 3, 8, { type: "char", text: "ROM" }, boardStoreState);
  }

  execute(): void {
    let addr = 0;
    for (let i = 0; i < this.inputPins.length; i++) {
      addr |= (this.inputPins[i].value > 0) << i;
    }
    const rom = this.properties.rom;
    if (!rom) return;
    const content = rom[addr];
    for (let i = 0; i < this.outputPins.length; i++) {
      this.outputPins[i].value = (content & (1 << i)) > 0 ? 1 : 0;
    }
  }
}
