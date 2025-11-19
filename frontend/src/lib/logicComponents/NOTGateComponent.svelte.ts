import type { Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";

export default class NOTGateComponent extends PrimitiveComponent {
	constructor(
		name: string | null,
		pos: Coord,
		boardStoreState: BoardStoreState,
	) {
		super(name, pos, 1, 1, { type: "char", text: "!" }, boardStoreState);
		this.addInputPin({ side: 3, pinIndex: 0 }, "IN");
		this.addOutputPin({ side: 1, pinIndex: 0 }, "OUT");
	}

	execute(): void {
		this.outputPins[0].value = 1 - this.inputPins[0].value;
	}
}
