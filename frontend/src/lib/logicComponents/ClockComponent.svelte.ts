import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";
import type { Coord } from "$/types";

export default class ClockComponent extends PrimitiveComponent {
	constructor(
		name: string | null,
		pos: Coord,
		boardStoreState: BoardStoreState,
	) {
		super(
			name,
			pos,
			2,
			1,
			{ type: "icon", text: "access_time" },
			boardStoreState,
		);
		this.addOutputPin({ side: 1, sideIndex: 0 }, "OUT");
		this.value = 0;
	}

	execute(): void {
		if (this.value === null) return;
		this.outputPins[0].value = this.value;
	}
}
