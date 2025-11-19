import type { Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";

export default class CounterComponent extends PrimitiveComponent {
	constructor(name: string | null, pos: Coord) {
		super(name, pos, 2, 1, { type: "value" });
		this.addInputPin({ side: 3, pinIndex: 0 }, "IN");
		this.value = 0;
	}

	execute(): void {
		if (this.inputPins[0].value === 1 && this.value === 0) this.value++;
	}
}
