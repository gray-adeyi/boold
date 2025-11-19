import type { Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";

export default class ConstantComponent extends PrimitiveComponent {
	constructor(
		name: string | null,
		pos: Coord,
		value: number = 0,

		boardStoreState: BoardStoreState,
	) {
		super(name, pos, 2, 1, { type: "value" }, boardStoreState);
		this.addOutputPin({ side: 1, pinIndex: 0 }, "OUT");
		this.value = value;
	}

	execute(): void {
		if (this.value === null) return;
		this.outputPins[0].value = this.value;
	}
}
