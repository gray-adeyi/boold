import { type BoardStoreState, scrollBoard } from "$/stores/boardStore.svelte";

export default class CanvasKeyboardEventManager {
	state: BoardStoreState;
	constructor(state: BoardStoreState) {
		console.log("keyboard event manager");
		this.state = state;
	}

	handleOnKeydown(event: KeyboardEvent) {
		console.log("new key event key", event.key);
		switch (event.key) {
			case "ArrowLeft":
				console.log("arrow left called");
				scrollBoard(-5, 0);
				break;
		}
	}
}
