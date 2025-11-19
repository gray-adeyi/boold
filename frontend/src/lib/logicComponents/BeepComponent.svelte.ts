import type { Coord } from "$/types";
import { beep } from "$/lib/audio";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import { state as boardStoreState } from "$/stores/boardStore.svelte";

export default class BeepComponent extends PrimitiveComponent {
	constructor(name: string | null, pos: Coord) {
		super(name, pos, 2, 1, { type: "icon", text: "audiotrack" });
		this.addInputPin({ side: 3, pinIndex: 0 }, "IN");
		this.properties.frequency = 700;
		this.properties.duration = 200;
	}

	execute(): void {
		if (
			this.inputPins[0].value === 1 &&
			this.properties.frequency &&
			this.properties.duration &&
			boardStoreState.audioCtx
		) {
			beep(
				boardStoreState.audioCtx,
				this.properties.frequency,
				this.properties.duration,
			);
		}
	}
}
