import type { BoardStoreState } from "$/stores/boardStore.svelte";
import type { AnyLogicComponent, ComponentPin } from "$/types";
import {
  addComponent,
  findAllWiresInSelectionWithoutConnections,
  findComponentByPos,
  findComponentPinByPos,
  findComponentsInUserSelection,
  findWireByPos,
} from "../logicComponents/componentManipulation.svelte";
import PrimitiveComponent from "../logicComponents/PrimitiveComponent.svelte";
import Wire from "../logicComponents/Wire.svelte";

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
        const x =
          this.state.mouse.screen.x / this.state.zoom + this.state.offset.x;
        const y =
          -this.state.mouse.screen.y / this.state.zoom + this.state.offset.y;
        this.state.scrollAnimation.animate = false;
        if (this.state.userSelection) {
          this.state.userDrag = {
            isDragSelecting: true,
            pos: {
              x: this.state.userSelection.pos.x,
              y: this.state.userSelection.pos.y,
            },
            dx: x - this.state.userSelection.pos.x,
            dy: y - this.state.userSelection.pos.y,
          };
        } else {
          const found = findComponentByPos(null, null, this.state);
          if (found) {
            this.state.userDrag = {
              component: found,
              pos: Object.assign({}, found.pos),
              dx: x - found.pos.x,
              dy: y - found.pos.y,
            };
            if (this.state.canvas) this.state.canvas.style.cursor = "move";
          } else {
            const found = findComponentPinByPos(null, null, this.state);
            if (found) {
              this.state.userDrag = {
                pin: found,
                sideIndex: Object.assign({}, found.placement.sideIndex),
              };
            }
          }
        }
      } else if (event.altKey) {
        event.preventDefault();
        this.state.scrollAnimation.animate = false;
        return;
      } else {
        if (this.state.userSelection) {
          // TODO: hide list element, context menu
          this.state.userSelection = null;
        } else {
          const found =
            findComponentByPos(null, null, this.state) ||
            findWireByPos(null, null, this.state) ||
            findComponentPinByPos(null, null, this.state);
          if (found instanceof PrimitiveComponent) {
            if (Object.hasOwn(found, "handleOnMouseDown")) {
              found.handleOnMouseDown();
            } else {
              found.update();
            }
          } else if (found instanceof Wire) {
            this.state.connectingWire = new Wire(
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              this.state,
            );
            this.state.connectingWire.inputConnections.push(found);
            this.state.connectingWire.path.push({
              x: this.state.mouse.grid.x,
              y: this.state.mouse.grid.y,
            });
          } else if (
            found &&
            Object.hasOwn(found, "type") &&
            ((found as ComponentPin).type === "input" ||
              (found as ComponentPin).type === "output")
          ) {
            if (found.type === "output") {
              this.state.connectingWire = new Wire(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                this.state,
              );
              this.state.connectingWire.from = found;
              this.state.connectingWire.path.push({
                x: this.state.mouse.grid.x,
                y: this.state.mouse.grid.y,
              });
            }
          } else {
            const component = new this.state.componentInSelectionFocus(
              null,
              { x: 0, y: 0 },
              this.state,
            );
            addComponent(
              component,
              this.state.mouse.grid.x,
              this.state.mouse.grid.y,
              false,
              this.state,
            );
          }
        }
      }
    } else if (event.button === MouseButton.RIGHT) {
      // right click
      // hide waypoints menu
      if (this.state.userSelection && !this.state.userDrag) {
        this.state.userSelection = null;
      } else if (this.state.userDrag) {
        if (
          "isDragSelecting" in this.state.userDrag &&
          this.state.userDrag.isDragSelecting
        ) {
          const component = this.state.userSelection?.components || [];
          const wires = this.state.userSelection?.wires || [];
          const animate = () => {
            if (
              !this.state.userDrag ||
              !this.state.userSelection ||
              !this.state.canvas
            )
              return;
            let dx = this.state.userDrag.pos.x - this.state.userSelection.pos.x;
            let dy = this.state.userDrag.pos.y - this.state.userSelection.pos.y;

            this.state.userSelection.pos.x += dx / 2.5;
            this.state.userSelection.pos.y += dy / 2.5;
            // TODO: Adjust context menu

            for (let i = 0; i < this.state.components.length; i++) {
              this.state.components[i].pos.x += dx / 2.5;
              this.state.components[i].pos.y += dy / 2.5;
            }

            for (let i = 0; i < this.state.wires.length; i++) {
              const path = this.state.wires[i].path;
              for (let j = 0; j < path.length; j++) {
                path[j].x += dx / 2.5;
                path[j].y += dy / 2.5;
              }
            }

            if (
              Math.abs(dx) * this.state.zoom > 1 ||
              Math.abs(dy) * this.state.zoom > 1
            ) {
              dx = dx - dx / 2.5;
              dy = dy - dy / 2.5;
              requestAnimationFrame(animate);
            } else {
              // Stop animation
              this.state.userSelection.pos.x = Math.round(
                this.state.userSelection.pos.x,
              );
              this.state.userSelection.pos.y = Math.round(
                this.state.userSelection.pos.y,
              );
              // TODO set context menu pos

              for (let i = 0; i < this.state.components.length; i++) {
                const component = this.state.components[i];
                component.pos.x = Math.round(component.pos.x);
                component.pos.y = Math.round(component.pos.y);
              }

              for (let i = 0; i < this.state.wires.length; i++) {
                const path = this.state.wires[i].path;
                for (let j = 0; j < path.length; j++) {
                  path[j].x = Math.round(path[j].x);
                  path[j].y = Math.round(path[j].y);
                }
              }
              this.state.userDrag = null;
              this.state.canvas.style.cursor = "crosshair";
            }
          };
          animate();
        } else if (
          "component" in this.state.userDrag &&
          this.state.userDrag.component
        ) {
          const component = this.state.userDrag.component;
          const animate = () => {
            if (!this.state.userDrag || !this.state.canvas) return;

            let dx = this.state.userDrag.pos.x - component.pos.x;
            let dy = this.state.userDrag.pos.y - component.pos.y;

            component.pos.x += dx / 2.5;
            component.pos.y += dy / 2.5;

            for (let i = 0; i < component.inputPins.length; i++) {
              const wire = component.inputPins[i].connection;
              if (wire) {
                wire.path.slice(-1)[0].x += dx / 2.5;
                wire.path.slice(-1)[0].y += dy / 2.5;
              }
            }
            
            for (let i = 0; i < component.outputPins.length; i++){
              const wire = component.outputPins[i].connection
              if(wire){
                wire.path[0].x += dx / 2.5 
                wire.path[0].y += dy / 2.5
              }
            }
            
            if(Math.abs(dx) * this.state.zoom > 1 || Math.abs(dy) * this.state.zoom > 1){
              dx = dx - dx / 2.5 
              dy = dy - dy / 2.5
              requestAnimationFrame(animate)
            } else {
              // stop animation
              component.pos.x = Math.round(component.pos.x)
              component.pos.y = Math.round(component.pos.y)
              
              for (let i = 0; i < component.inputPins.length; i++){
                const wire = component.inputPins[i].connection
                if(wire){
                  wire.path.slice(-1)[0].x = Math.round(wire.path.slice(-1)[0].x)
                  wire.path.slice(-1)[0].y = Math.round(wire.path.slice(-1)[0].y)
                }
              }
              
              for (let i = 0; i < component.outputPins.length; i++){
                const wire = component.outputPins[i].connection
                if(wire){
                  wire.path[0].x = Math.round(wire.path[0].x)
                  wire.path[0].y = Math.round(wire.path[0].y)
                }
              }
              
              this.state.userDrag = null 
              this.state.canvas.style.cursor = "crosshair"
            }
          };
          animate();
        } else if ("pin" in this.state.userDrag && this.state.userDrag.pin) {
          this.state.userDrag.pin.placement.side =
            this.state.userDrag.placement.side;
          this.state.userDrag.pin.placement.sideIndex =
            this.state.userDrag.placement.sideIndex;
        }
      } else if (this.state.connectingWire) {
        this.state.connectingWire = null;
      } else {
        // TODO: show context menu
      }
    } else if (event.button === MouseButton.MIDDLE) {
      this.state.mouse.isMouseWheelClicked = true;
      this.state.scrollAnimation.animate = false;
      return;
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

  handleOnMouseUp(event: MouseEvent) {}

  handleOnDblClick(event: MouseEvent) {}

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
