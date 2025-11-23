import type { Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";

export default class DisplayComponent extends PrimitiveComponent {
	private lineWidth: number;
	private hOffset: number;
	private colorOff: string;
	private colorOn: string;
	constructor(
		name: string | null,
		pos: Coord,
		color = "#a00",
		boardStoreState: BoardStoreState,
	) {
		super(name, pos, 4, 5, { type: "value" }, boardStoreState);
		this.addInputPin({ side: 0, sideIndex: 0 }, "A");
		this.addInputPin({ side: 0, sideIndex: 1 }, "B");
		this.addInputPin({ side: 0, sideIndex: 2 }, "C");
		this.addInputPin({ side: 0, sideIndex: 3 }, "D");
		this.addInputPin({ side: 2, sideIndex: 0 }, "E");
		this.addInputPin({ side: 2, sideIndex: 1 }, "F");
		this.addInputPin({ side: 2, sideIndex: 2 }, "G");
		this.addInputPin({ side: 2, sideIndex: 3 }, "DP");
		this.value = 0;

		this.lineWidth = 0.12;
		this.hOffset = this.width / 8;
		this.colorOff = "#300";
		this.colorOn = "#f00";
	}
}
