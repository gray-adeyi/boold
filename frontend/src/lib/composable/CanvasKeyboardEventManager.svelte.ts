import { type BoardStoreState, changeBoardZoom, scrollBoard } from "$/stores/boardStore.svelte";
import {
  findComponentByPos,
  findWireByPos,
  removeComponent,
  removeSelection,
  removeWire,
} from "../logicComponents/componentManipulation.svelte";

export default class CanvasKeyboardEventManager {
  state: BoardStoreState;
  constructor(state: BoardStoreState) {
    this.state = state;
  }

  handleOnKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        scrollBoard(-5, 0);
        break;
      case "ArrowUp":
        scrollBoard(0, 5);
        break;
      case "ArrowRight":
        scrollBoard(5, 0);
        break;
      case "ArrowDown":
        scrollBoard(0, -5);
        break;
      case "Home":
        scrollBoard(-this.state.offset.x, -this.state.offset.y);
        break;
      case "Delete":
        this.handleDelete();
        break;
      case "PageUp":
        this.zoomIn();
        break;
      case "PageDown":
        this.zoomOut();
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        console.log("TODO: Implement toolbar shortcuts");
        break;
      case "c":
      case "e":
      case "o":
      case "p":
      case "r":
      case "s":
      case "t":
      case "v":
      case "w":
      case "z":
      case "Tab":
      case "F1":
      case "F3":
      case "ContextMenu":
        break;
    }
  }

  private handleDelete() {
    if (this.state.userSelection && this.state.userSelection.components) {
      removeSelection(
        this.state.userSelection.components,
        this.state.userSelection.wires,
        this.state,
      );
      this.state.userSelection = null;
      // TODO: Hide context menu
    } else {
      const component = findComponentByPos(null, null, this.state);
      if (component) {
        removeComponent(component, this.state);
      }
      const wire = findWireByPos(null, null, this.state);
      if (wire) {
        removeWire(wire, this.state);
      }
    }
  }

  private zoomIn() {
    changeBoardZoom(this.state.zoom / 2);
  }

  private zoomOut() {
    changeBoardZoom(this.state.zoom / -2);
  }
}
