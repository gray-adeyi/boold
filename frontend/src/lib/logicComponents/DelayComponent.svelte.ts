import type { Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";

export default class DelayComponent extends PrimitiveComponent {
	constructor(
		name: string | null,
		pos: Coord,
		boardStoreState: BoardStoreState,
	) {
		super(name, pos, 2, 1, { type: "icon", text: "timer" }, boardStoreState);
		this.addInputPin({ side: 3, pinIndex: 0 }, "IN");
		this.addOutputPin({ side: 1, pinIndex: 0 }, "OUT");
	}
}
