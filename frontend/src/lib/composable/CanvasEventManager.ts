import type { BoardStoreState } from "$/stores/boardStore.svelte";
import {
  findAllWiresInSelectionWithoutConnections,
  findComponentsInUserSelection,
} from "../logicComponents/componentManipulation.svelte";

export enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
  BROWSER_BACK = 3,
  BROWSER_FORWARD = 4,
}

export default class CanvasEventManager {
  state: BoardStoreState;
  constructor(state: BoardStoreState) {
    this.state = state;
  }

  handleOnMouseLeave(_event: MouseEvent) {
    this.state.scrollAnimation.animate = true;
    this.state.connectingWire = null;
  }

  handleOnMouseEnter(event: MouseEvent) {
    if (event.button > MouseButton.LEFT)
      this.state.scrollAnimation.animate = false;
  }

  handleOnMouseDown(event: MouseEvent) {
    this.state.mouse.screen.x = event.x;
    this.state.mouse.screen.y = event.y;
    this.state.mouse.grid.x = Math.round(
      event.x / this.state.zoom + this.state.offset.x,
    );
    this.state.mouse.grid.y = Math.round(
      -event.y / this.state.zoom + this.state.offset.y,
    );

    // left click
    if (event.button === MouseButton.LEFT) {
      if (event.shiftKey) {
        if (this.state.userSelection) {
          const x = this.state.mouse.grid.x;
          const y = this.state.mouse.grid.y;

          const animate = () => {
            if (!this.state.userSelection) return;
            this.state.userSelection.dimension.width +=
              (x -
                this.state.userSelection.pos.x -
                this.state.userSelection.dimension.width) /
              4;
            this.state.userSelection.dimension.height +=
              (y -
                this.state.userSelection.pos.y -
                this.state.userSelection.dimension.height) /
              4;

            if (
              Math.abs(
                x -
                  this.state.userSelection.pos.x -
                  this.state.userSelection.dimension.width,
              ) *
                this.state.zoom >
                1 ||
              Math.abs(
                y -
                  this.state.userSelection.pos.y -
                  this.state.userSelection.dimension.height,
              ) *
                this.state.zoom >
                1
            ) {
              requestAnimationFrame(animate);
            } else {
              this.state.userSelection.dimension.width =
                x - this.state.userSelection.pos.x;
              this.state.userSelection.dimension.height =
                y - this.state.userSelection.pos.y;
              // TODO: show context menu
            }
          };
          animate();

          this.state.userSelection.components = findComponentsInUserSelection(
            this.state.userSelection.pos.x,
            this.state.userSelection.pos.y,
            x - this.state.userSelection.pos.x,
            y - this.state.userSelection.pos.y,
            this.state,
          );

          this.state.userSelection.wires =
            findAllWiresInSelectionWithoutConnections(
              this.state.userSelection.pos.x,
              this.state.userSelection.pos.y,
              x - this.state.userSelection.pos.x,
              y - this.state.userSelection.pos.y,
              this.state,
            );
        } else {
          this.state.userSelection = {
            pos: {
              x: Math.round(event.x / this.state.zoom + this.state.offset.x),
              y: Math.round(-(event.y / this.state.zoom - this.state.offset.y)),
            },
            dimension: {
              width: 0,
              height: 0,
            },
            components: [],
            wires: [],
            dashOffset: 0,
          };
        }
      } else if (event.ctrlKey) {
      } else if (event.altKey) {
      } else {
      }
    } else if (event.button === MouseButton.RIGHT) {
      // right click
    } else if (event.button === MouseButton.MIDDLE) {
    }
  }

  handleOnMouseMove(event: MouseEvent) {
    this.state.mouse.screen.x = event.x;
    this.state.mouse.screen.y = event.y;
    this.state.mouse.grid.x = Math.round(
      event.x / this.state.zoom + this.state.offset.x,
    );
    this.state.mouse.grid.y = Math.round(
      -event.y / this.state.zoom + this.state.offset.y,
    );

    // left click
    if (event.button === MouseButton.LEFT) {
    } else if (event.button === MouseButton.RIGHT) {
      // right click
    }
  }
  
  handleOnMouseUp(event: MouseEvent){}
  
  handleOnDblClick(event: MouseEvent){}

  handleOnMouseWheel(event: WheelEvent) {
    event.preventDefault();
    this.state.mouse.screen.x = event.x;
    this.state.mouse.screen.y = event.y;
    this.state.mouse.grid.x = Math.round(
      event.x / this.state.zoom + this.state.offset.x,
    );
    this.state.mouse.grid.y = Math.round(
      -event.y / this.state.zoom + this.state.offset.y,
    );
    this.state.zoomAnimation = Math.min(
      Math.max(
        this.state.zoomAnimation -
          (this.state.zoom / 8) *
            ((event.deltaX || event.deltaY) > 0 ? 0.5 : -1),
        2,
      ),
      300,
    );
    return false;
  }
}
