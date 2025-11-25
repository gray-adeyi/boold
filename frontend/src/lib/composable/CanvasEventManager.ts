import type { BoardStoreState } from "$/stores/boardStore.svelte";

export default class CanvasEventManager {
  state: BoardStoreState;
  constructor(state: BoardStoreState) {
    this.state = state;
  }
  
  handleOnMouseMove(event: MouseEvent){
    this.state.mouse.screen.x = event.x
    this.state.mouse.screen.y = event.y
    this.state.mouse.grid.x = Math.round(event.x / this.state.zoom + this.state.offset.x)
    this.state.mouse.grid.y = Math.round(-event.y / this.state.zoom + this.state.offset.y)
    
    // left click
    if (event.button === 0){
      
    } else if(event.button === 2) { // right click
      
    }
  }

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
    return false
  }
}
