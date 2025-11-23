import type { Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";

export default class XORGateComponent extends PrimitiveComponent {
	constructor(
		name: string | null,
		pos: Coord,
		boardStoreState: BoardStoreState,
	) {
		super(name, pos, 2, 2, { type: "char", text: "^" }, boardStoreState);
		this.addInputPin({ side: 3, sideIndex: 0 }, "A");
		this.addInputPin({ side: 3, sideIndex: 1 }, "B");
		this.addOutputPin({ side: 1, sideIndex: 0 }, "OUT");
	}

	execute(): void {
		this.outputPins[0].value =
			this.inputPins[0].value ^ this.inputPins[1].value;
	}
}
