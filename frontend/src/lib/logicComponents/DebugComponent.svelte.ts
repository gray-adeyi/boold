import type { Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";

export default class DebugComponent extends PrimitiveComponent {
	constructor(name: string | null, pos: Coord) {
		super(name, pos, 2, 1, { type: "icon", text: "report_problem" });
		this.addInputPin({ side: 3, pinIndex: 0 }, "IN");
		this.value = 0;
	}

	execute(): void {
		if (this.value === null) return;
		this.inputPins[0].value = this.value;
		// notifications.push(`${this.name}: ${this.value}`)
		// boolrConsole.log(`${this.name}: ${this.value}`)
	}
}
