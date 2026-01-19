import type { BoardStoreState } from "$/stores/boardStore.svelte";
import type { AnyLogicComponentClass, ComponentPin } from "$/types";
import {
  addComponent,
  connectComponents,
  connectWires,
  findAllWiresInPos,
  findAllWiresInSelectionWithoutConnections,
  findComponentByPos,
  findComponentPinByPos,
  findComponentsInUserSelection,
  findWireByPos,
  moveComponentPin,
  moveSelection,
  selectComponent,
} from "../logicComponents/componentManipulation.svelte";
import PrimitiveComponent from "../logicComponents/PrimitiveComponent.svelte";
import Wire from "../logicComponents/Wire.svelte";
import type ClickableComponent from "$/lib/logicComponents/ClickableComponent"; // using the bitmask values so you're expected to compare with MouseEvent.buttons instead of MouseEvent.button

// using the bitmask values so you're expected to compare with MouseEvent.buttons instead of MouseEvent.button
export enum MouseButton {
  LEFT = 1,
  RIGHT = 2,
  MIDDLE = 4,
  BROWSER_BACK = 8,
  BROWSER_FORWARD = 16,
}

export default class CanvasMouseEventManager {
  state: BoardStoreState;
  constructor(state: BoardStoreState) {
    this.state = state;
  }

  handleOnMouseLeave(_event: MouseEvent) {
    this.state.scrollAnimation.animate = true;
    this.state.connectingWire = null;
  }

  handleOnMouseEnter(event: MouseEvent) {
    if (event.buttons > MouseButton.LEFT) this.state.scrollAnimation.animate = false;
  }

  handleOnMouseDown(event: MouseEvent) {
    this.state.mouse.screen.x = event.x;
    this.state.mouse.screen.y = event.y;
    this.state.mouse.grid.x = Math.round(event.x / this.state.zoom + this.state.offset.x);
    this.state.mouse.grid.y = Math.round(-event.y / this.state.zoom + this.state.offset.y);

    // left-click
    if (event.buttons === MouseButton.LEFT) {
      if (event.shiftKey) {
        if (this.state.userSelection) {
          const x = this.state.mouse.grid.x;
          const y = this.state.mouse.grid.y;

          const animate = () => {
            if (!this.state.userSelection) return;
            this.state.userSelection.dimension.width +=
              (x - this.state.userSelection.pos.x - this.state.userSelection.dimension.width) / 4;
            this.state.userSelection.dimension.height +=
              (y - this.state.userSelection.pos.y - this.state.userSelection.dimension.height) / 4;

            if (
              Math.abs(
                x - this.state.userSelection.pos.x - this.state.userSelection.dimension.width,
              ) *
                this.state.zoom >
                1 ||
              Math.abs(
                y - this.state.userSelection.pos.y - this.state.userSelection.dimension.height,
              ) *
                this.state.zoom >
                1
            ) {
              requestAnimationFrame(animate);
            } else {
              this.state.userSelection.dimension.width = x - this.state.userSelection.pos.x;
              this.state.userSelection.dimension.height = y - this.state.userSelection.pos.y;
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

          this.state.userSelection.wires = findAllWiresInSelectionWithoutConnections(
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
        const x = this.state.mouse.screen.x / this.state.zoom + this.state.offset.x;
        const y = -this.state.mouse.screen.y / this.state.zoom + this.state.offset.y;
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
                placement: Object.assign({}, found.placement),
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
            if ("handleClick" in found) {
              (found as unknown as ClickableComponent).handleClick("mousedown");
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
            "type" in found &&
            ((found as ComponentPin).type === "input" || (found as ComponentPin).type === "output")
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
            const component = new this.state.componentClassInSelectionFocus(
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
    } else if (event.buttons === MouseButton.MIDDLE) {
      // right-click
      // hide waypoints menu
      if (this.state.userSelection && !this.state.userDrag) {
        this.state.userSelection = null;
      } else if (this.state.userDrag) {
        if ("isDragSelecting" in this.state.userDrag && this.state.userDrag.isDragSelecting) {
          const _component = this.state.userSelection?.components || [];
          const _wires = this.state.userSelection?.wires || [];
          const animate = () => {
            if (!this.state.userDrag || !this.state.userSelection || !this.state.canvas) return;
            if (!("pos" in this.state.userDrag)) return;
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

            if (Math.abs(dx) * this.state.zoom > 1 || Math.abs(dy) * this.state.zoom > 1) {
              dx = dx - dx / 2.5;
              dy = dy - dy / 2.5;
              requestAnimationFrame(animate);
            } else {
              // Stop animation
              this.state.userSelection.pos.x = Math.round(this.state.userSelection.pos.x);
              this.state.userSelection.pos.y = Math.round(this.state.userSelection.pos.y);
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
        } else if ("component" in this.state.userDrag && this.state.userDrag.component) {
          const component = this.state.userDrag.component;
          const animate = () => {
            if (!this.state.userDrag || !this.state.canvas) return;
            if (!("pos" in this.state.userDrag)) return;

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

            for (let i = 0; i < component.outputPins.length; i++) {
              const wire = component.outputPins[i].connection;
              if (wire) {
                wire.path[0].x += dx / 2.5;
                wire.path[0].y += dy / 2.5;
              }
            }

            if (Math.abs(dx) * this.state.zoom > 1 || Math.abs(dy) * this.state.zoom > 1) {
              dx = dx - dx / 2.5;
              dy = dy - dy / 2.5;
              requestAnimationFrame(animate);
            } else {
              // stop animation
              component.pos.x = Math.round(component.pos.x);
              component.pos.y = Math.round(component.pos.y);

              for (let i = 0; i < component.inputPins.length; i++) {
                const wire = component.inputPins[i].connection;
                if (wire) {
                  wire.path.slice(-1)[0].x = Math.round(wire.path.slice(-1)[0].x);
                  wire.path.slice(-1)[0].y = Math.round(wire.path.slice(-1)[0].y);
                }
              }

              for (let i = 0; i < component.outputPins.length; i++) {
                const wire = component.outputPins[i].connection;
                if (wire) {
                  wire.path[0].x = Math.round(wire.path[0].x);
                  wire.path[0].y = Math.round(wire.path[0].y);
                }
              }

              this.state.userDrag = null;
              this.state.canvas.style.cursor = "crosshair";
            }
          };
          animate();
        } else if ("pin" in this.state.userDrag && this.state.userDrag.pin) {
          this.state.userDrag.pin.placement.side = this.state.userDrag.placement.side;
          this.state.userDrag.pin.placement.sideIndex = this.state.userDrag.placement.sideIndex;
        }
      } else if (this.state.connectingWire) {
        this.state.connectingWire = null;
      } else {
        // TODO: show context menu
      }
    } else if (event.buttons === MouseButton.RIGHT) {
      this.state.mouse.isMouseWheelClicked = true;
      this.state.scrollAnimation.animate = false;
      return;
    }
  }

  handleOnMouseMove(event: MouseEvent) {
    this.state.mouse.screen.x = event.x;
    this.state.mouse.screen.y = event.y;
    this.state.mouse.grid.x = Math.round(event.x / this.state.zoom + this.state.offset.x);
    this.state.mouse.grid.y = Math.round(-event.y / this.state.zoom + this.state.offset.y);

    // left-click
    if (event.buttons === MouseButton.LEFT) {
      if (this.state.userSelection && !this.state.userSelection.components.length) {
        if (event.ctrlKey) {
          this.state.offset.x -= event.movementX / this.state.zoom;
          this.state.offset.y += event.movementY / this.state.zoom;
          return;
        }
        this.state.userSelection.dimension.width =
          event.x / this.state.zoom + this.state.offset.x - this.state.userSelection.pos.x;
        this.state.userSelection.dimension.height =
          -(event.y / this.state.zoom - this.state.offset.y) - this.state.userSelection.pos.y;
      } else if (this.state.userDrag) {
        if (
          "isDragSelecting" in this.state.userDrag &&
          this.state.userDrag.isDragSelecting &&
          this.state.userSelection
        ) {
          const components = this.state.userSelection.components;
          const wires = this.state.userSelection.wires;

          const x = this.state.mouse.screen.x / this.state.zoom + this.state.offset.x;
          const y = -this.state.mouse.screen.y / this.state.zoom + this.state.offset.y;

          const dx = x - this.state.userDrag.dx - this.state.userSelection.pos.x;
          const dy = y - this.state.userDrag.dy - this.state.userSelection.pos.y;

          // If we are dragging a selection, we are first going to move the selection box and the context menu
          this.state.userSelection.pos.x += dx;
          this.state.userSelection.pos.y += dy;
          // TODO: move context

          // Loop over all the components within the selections and move them
          for (let i = 0; i < components.length; i++) {
            const component = components[i];
            component.pos.x += dx;
            component.pos.y += dy;

            for (let i = 0; i < component.inputPins.length; i++) {
              const wire = component.inputPins[i].connection;
              if (wire && !wires.includes(wire)) {
                wire.path.slice(-1)[0].x += dx;
                wire.path.slice(-1)[0].y += dy;
              }
            }

            for (let i = 0; i < component.outputPins.length; i++) {
              const wire = component.outputPins[i].connection;
              if (wire && !wires.includes(wire)) {
                wire.path[0].x += dx;
                wire.path[0].y += dy;
              }
            }
          }

          // Loop over all the wires within the selections and move them
          for (let i = 0; i < wires.length; i++) {
            const path = wires[i].path;
            for (let j = 0; j < path.length; j++) {
              path[j].x += dx;
              path[j].y += dy;
            }

            const intersections = wires[i].intersections;
            for (let j = 0; j < intersections.length; j++) {
              intersections[j].pos.x += dx;
              intersections[j].pos.y += dy;
            }
          }
        } else if ("component" in this.state.userDrag && this.state.userDrag.component) {
          const component = this.state.userDrag.component;

          const x = this.state.mouse.screen.x / this.state.zoom + this.state.offset.x;
          const y = -this.state.mouse.screen.y / this.state.zoom + this.state.offset.y;

          const dx = x - this.state.userDrag.dx - component.pos.x;
          const dy = y - this.state.userDrag.dy - component.pos.y;

          // Add the delta mouse x and y (e.movementX and e.movementY) to the position of the component the user is dragging
          component.pos.x = x - this.state.userDrag.dx;
          component.pos.y = y - this.state.userDrag.dy;

          // Then, all the wires to and from the component need to be fixed...
          for (let i = 0; i < component.inputPins.length; i++) {
            const wire = component.inputPins[i].connection;
            if (wire) {
              wire.path.slice(-1)[0].x += dx;
              wire.path.slice(-1)[0].y += dy;
            }
          }

          for (let i = 0; i < component.outputPins.length; i++) {
            const wire = component.outputPins[i].connection;
            if (wire) {
              wire.path[0].x += dx;
              wire.path[0].y += dy;
            }
          }
        } else if ("pin" in this.state.userDrag && this.state.userDrag.pin) {
          const pin = this.state.userDrag.pin;
          const placment = pin.placement;
          const component = pin.component;

          const x = this.state.mouse.screen.x / this.state.zoom + this.state.offset.x;
          const y = -this.state.mouse.screen.y / this.state.zoom + this.state.offset.y;

          const dx = x - component.pos.x;
          const dy = component.pos.y - y;

          if (dy < -0.5 && dx > -0.5 && dx < component.width - 0.5) {
            placment.side = 0;
            placment.sideIndex = dx;
          } else if (dx > component.width - 0.5 && dy > -0.5 && dy < component.height - 0.5) {
            placment.side = 1;
            placment.sideIndex = dy;
          } else if (dy > component.height - 0.5 && dx > -0.5 && dx < component.width - 0.5) {
            placment.side = 2;
            placment.sideIndex = dx;
          } else if (dx < -0.5 && dy > -0.5 && dy < component.height - 0.5) {
            placment.side = 3;
            placment.sideIndex = dy;
          }

          if (pin.connection) {
            const placement = pin.placement;
            const gridPos = Object.assign({}, component.pos);

            const angle = (Math.PI / 2) * placement.side;
            gridPos.x += Math.sin(angle);
            gridPos.y += Math.cos(angle);
            if (placement.side === 1) {
              gridPos.x += component.width - 1;
            } else if (placement.side === 2) {
              gridPos.y -= component.height - 1;
            }

            if (placement.side % 2 === 0) {
              gridPos.x += placement.sideIndex;
            } else {
              gridPos.y -= placement.sideIndex;
            }

            if (pin.type === "input") {
              pin.connection.path.slice(-1)[0].x = gridPos.x;
              pin.connection.path.slice(-1)[0].y = gridPos.y;
            } else {
              pin.connection.path[0].x = gridPos.x;
              pin.connection.path[0].y = gridPos.y;
            }
          }
        }
      } else if (this.state.connectingWire) {
        // Scroll and return if the user is holding the ctrl key
        if (event.ctrlKey && this.state.connectingWire.path.length > 1) {
          this.state.offset.x -= event.movementX / this.state.zoom;
          this.state.offset.y += event.movementY / this.state.zoom;
          return;
        }

        // Calculate the delta x and y
        let dx = this.state.mouse.grid.x - this.state.connectingWire.path.slice(-1)[0].x;
        let dy = this.state.mouse.grid.y - this.state.connectingWire.path.slice(-1)[0].y;

        // If dx and dy are both 0, no new positions have to be put into the wire's 'pos' array: return
        if (!dx && !dy) return;

        // If the shift key is down, we want the wire to be drawn in a straight line
        if (event.shiftKey) {
          if (!("lock" in this.state.connectingWire)) {
            if (event.movementX !== event.movementY)
              this.state.connectingWire.lock =
                Math.abs(event.movementX) < Math.abs(event.movementY);
          } else {
            if (this.state.connectingWire.lock) {
              dx = 0;
            } else {
              dy = 0;
            }
          }
        } else {
          delete this.state.connectingWire.lock;
        }

        while ((dx || dy) && dx + dy < 10_000) {
          const prev = this.state.connectingWire.path.slice(-2)[0];
          const last = this.state.connectingWire.path.slice(-1)[0];

          if (Math.abs(dx) > Math.abs(dy)) {
            if (
              prev &&
              last &&
              last.x + Math.sign(dx) === prev.x &&
              last.y === this.state.connectingWire.path.slice(-2)[0].y
            ) {
              this.state.connectingWire.path.splice(-1);
            } else {
              this.state.connectingWire.path.push({
                x: last.x + Math.sign(dx),
                y: last.y,
              });
            }
            dx = dx - Math.sign(dx);
          } else {
            if (prev && last && last.x === prev.x && last.y + Math.sign(dy) === prev.y) {
              this.state.connectingWire.path.splice(-1);
            } else {
              this.state.connectingWire.path.push({
                x: last.x,
                y: last.y + Math.sign(dy),
              });
            }
            dy = dy - Math.sign(dy);
          }
        }

        const to = findComponentPinByPos(
          this.state.connectingWire.path.slice(-1)[0].x,
          this.state.connectingWire.path.slice(-1)[0].y,
          this.state,
        );

        if (to && to.type === "input") {
          this.state.connectingWire.to = to;
          this.state.wires.push(this.state.connectingWire);

          if (this.state.connectingWire.inputConnections.length > 0) {
            connectWires(this.state.connectingWire.inputConnections[0], this.state.connectingWire);
            /*
              Give the intersection point to the wire with the highest index,
              so the intersection point is drawn
            */
            if (
              this.state.wires.indexOf(this.state.connectingWire) >
              this.state.wires.indexOf(this.state.connectingWire.inputConnections[0])
            ) {
              this.state.connectingWire.intersections.push({
                type: 0,
                pos: this.state.connectingWire.path[0],
              });
            } else {
              this.state.connectingWire.inputConnections[0].intersections.push({
                type: 0,
                pos: this.state.connectingWire.path[0],
              });
            }
          }

          if (this.state.connectingWire.from)
            connectComponents(
              this.state.connectingWire.from,
              to,
              this.state.connectingWire,
              this.state,
            );
          this.state.connectingWire = null;
        }
      } else if (event.altKey) {
        event.preventDefault();
        this.state.offset.x -= event.movementX / this.state.zoom;
        this.state.offset.y += event.movementY / this.state.zoom;

        this.state.scrollAnimation.v =
          Math.sqrt(event.movementX ** 2 + event.movementY ** 2) / this.state.zoom;
        this.state.scrollAnimation.r = Math.atan2(event.movementX, event.movementY);
        return;
      } else if (event.ctrlKey) {
        event.preventDefault();
        this.state.offset.x -= event.movementX / this.state.zoom;
        this.state.offset.y += event.movementY / this.state.zoom;

        this.state.scrollAnimation.v =
          Math.sqrt(event.movementX ** 2 + event.movementY ** 2) / this.state.zoom;
        this.state.scrollAnimation.r = Math.atan2(event.movementX, event.movementY);
        return;
      }
    } else if (event.buttons === MouseButton.MIDDLE) {
      // middle click
      this.state.offset.x -= event.movementX / this.state.zoom;
      this.state.offset.y += event.movementY / this.state.zoom;

      this.state.scrollAnimation.v =
        Math.sqrt(event.movementX ** 2 + event.movementY ** 2) / this.state.zoom;
      this.state.scrollAnimation.r = Math.atan2(event.movementX, event.movementY);

      this.state.mouse.isMouseWheelClicked = false;
    }
  }

  handleOnMouseUp(event: MouseEvent) {
    this.state.mouse.screen.x = event.x;
    this.state.mouse.screen.y = event.y;
    this.state.mouse.grid.x = Math.round(event.y / this.state.zoom + this.state.offset.x);
    this.state.mouse.grid.y = Math.round(-event.y / this.state.zoom + this.state.offset.y);

    if (event.buttons === MouseButton.LEFT) {
      if (
        this.state.userSelection &&
        !this.state.userSelection.components.length &&
        !this.state.userDrag
      ) {
        if (
          Math.abs(this.state.userSelection.dimension.width) < 0.5 &&
          Math.abs(this.state.userSelection.dimension.height) < 0.5
        ) {
          return;
        } else {
          this.state.userSelection.components = findComponentsInUserSelection(
            this.state.userSelection.pos.x,
            this.state.userSelection.pos.y,
            Math.round(this.state.userSelection.dimension.width),
            Math.round(this.state.userSelection.dimension.height),
            this.state,
          );
          this.state.userSelection.wires = findAllWiresInSelectionWithoutConnections(
            this.state.userSelection.pos.x,
            this.state.userSelection.pos.y,
            Math.round(this.state.userSelection.dimension.width),
            Math.round(this.state.userSelection.dimension.height),
            this.state,
          );

          const animate = () => {
            if (!this.state.userSelection) return;
            this.state.userSelection.dimension.width +=
              (Math.round(this.state.userSelection.dimension.width) -
                this.state.userSelection.dimension.width) /
              4;
            this.state.userSelection.dimension.height +=
              (Math.round(this.state.userSelection.dimension.height) -
                this.state.userSelection.dimension.height) /
              4;

            if (
              Math.abs(
                Math.round(this.state.userSelection.dimension.width) -
                  this.state.userSelection.dimension.width,
              ) *
                this.state.zoom >
                1 ||
              Math.abs(
                Math.round(this.state.userSelection.dimension.height) -
                  this.state.userSelection.dimension.height,
              ) *
                this.state.zoom >
                1
            ) {
              requestAnimationFrame(animate);
            } else {
              this.state.userSelection.dimension.width = Math.round(
                this.state.userSelection.dimension.width,
              );
              this.state.userSelection.dimension.height = Math.round(
                this.state.userSelection.dimension.height,
              );

              // TODO: show context menu
            }
          };
          animate();
        }
      } else if (this.state.userDrag) {
        if (
          "isDragSelecting" in this.state.userDrag &&
          this.state.userDrag.isDragSelecting &&
          this.state.userSelection
        ) {
          /*
					The x and y coordinate of the selection need to be integers. While dragging, they are floats. So I created a little animation for the x
					and y coordinates of the selection becoming integers.
					*/
          const components = this.state.userSelection.components;
          const wires = this.state.wires;

          const animate = () => {
            if (!this.state.userSelection || !this.state.userDrag || !this.state.canvas) return;
            if (!("pos" in this.state.userDrag)) return;
            let dx = Math.round(this.state.userSelection.pos.x) - this.state.userSelection.pos.x;
            let dy = Math.round(this.state.userSelection.pos.y) - this.state.userSelection.pos.y;

            this.state.userSelection.pos.x += dx / 2.5;
            this.state.userSelection.pos.y += dy / 2.5;

            for (let i = 0; i < this.state.components.length; i++) {
              const component = components[i];
              component.pos.x += dx / 2.5;
              component.pos.y += dy / 2.5;

              for (let i = 0; i < component.inputPins.length; i++) {
                const wire = component.inputPins[i].connection;
                if (wire && wires.includes(wire)) {
                  wire.path.slice(-1)[0].x += dx / 2.5;
                  wire.path.slice(-1)[0].y += dy / 2.5;
                }
              }

              for (let i = 0; i < component.outputPins.length; i++) {
                const wire = component.outputPins[i].connection;
                if (wire && !wires.includes(wire)) {
                  wire.path[0].x += dx / 2.5;
                  wire.path[0].y += dy / 2.5;
                }
              }
            }

            for (let i = 0; i < wires.length; i++) {
              const path = wires[i].path;
              for (let j = 0; j < path.length; i++) {
                path[j].x += dx / 2.5;
                path[j].y += dy / 2.5;
              }

              const { intersections } = wires[i];
              for (let j = 0; j < intersections.length; j++) {
                intersections[j].pos.x += dx / 2.5;
                intersections[j].pos.y += dy / 2.5;
              }
            }

            if (Math.abs(dx) * this.state.zoom > 1 || Math.abs(dy) * this.state.zoom > 1) {
              dx = dx - dx / 2.5;
              dy = dy - dy / 2.5;
              requestAnimationFrame(animate);
            } else {
              // Stop animation
              this.state.userSelection.pos.x = Math.round(this.state.userSelection.pos.x);
              this.state.userSelection.pos.y = Math.round(this.state.userSelection.pos.y);
              // TODO: update context menu pos

              for (let i = 0; i < components.length; i++) {
                const component = components[i];
                component.pos.x = Math.round(component.pos.x);
                component.pos.y = Math.round(component.pos.y);

                for (let i = 0; i < component.inputPins.length; i++) {
                  const wire = component.inputPins[i].connection;
                  if (wire && !wires.includes(wire)) {
                    wire.path.slice(-1)[0].x = Math.round(wire.path.slice(-1)[0].x);
                    wire.path.slice(-1)[0].y = Math.round(wire.path.slice(-1)[0].y);
                  }
                }

                for (let i = 0; i < component.outputPins.length; i++) {
                  const wire = component.outputPins[i].connection;
                  if (wire && !wires.includes(wire)) {
                    wire.path[0].x = Math.round(wire.path[0].x);
                    wire.path[0].y = Math.round(wire.path[0].y);
                  }
                }
              }

              for (let i = 0; i < wires.length; i++) {
                const path = wires[i].path;
                for (let j = 0; j < path.length; j++) {
                  path[j].x = Math.round(path[j].x);
                  path[j].y = Math.round(path[j].y);
                }

                const { intersections } = wires[i];
                for (let j = 0; j < intersections.length; j++) {
                  intersections[j].pos.x = Math.round(intersections[j].pos.x);
                  intersections[j].pos.y = Math.round(intersections[j].pos.y);
                }
              }

              // Only for undo purposes
              const dx = this.state.userSelection.pos.x - this.state.userDrag.pos.x;
              const dy = this.state.userSelection.pos.y - this.state.userDrag.pos.y;
              moveSelection(
                this.state.userSelection.components,
                this.state.userSelection.wires,
                -dx,
                -dy,
                this.state,
              );
              moveSelection(
                this.state.userSelection.components,
                this.state.userSelection.wires,
                dx,
                dy,
                this.state,
              );

              this.state.userDrag = null;
              this.state.canvas.style.cursor = "crosshair";
            }
          };
          animate();
        } else {
          if ("component" in this.state.userDrag && this.state.userDrag.component) {
            /*
					  The x and y coordinate of the component need to be integers. While dragging, they are floats. So I created a little animation for the x
					  and y coordinates of the component becoming integers.
					*/
            const _component = this.state.userDrag.component;
            const animate = () => {};
            animate();
          } else if ("pin" in this.state.userDrag && this.state.userDrag.pin) {
            const pin = this.state.userDrag.pin;
            pin.placement.sideIndex = Math.round(pin.placement.sideIndex);

            for (let i = 0; i < pin.component.inputPins.length; i++) {
              const pin2 = pin.component.inputPins[i];
              if (pin2 === pin) continue;
              if (
                pin2.placement.side === pin.placement.side &&
                pin2.placement.sideIndex === pin.placement.sideIndex
              ) {
                pin.placement.side = this.state.userDrag.placement.side;
                pin.placement.sideIndex = this.state.userDrag.placement.sideIndex;
              }
            }

            for (let i = 0; i < pin.component.outputPins.length; i++) {
              const pin2 = pin.component.outputPins[i];
              if (pin2 === pin) continue;
              if (
                pin2.placement.side === pin.placement.side &&
                pin2.placement.sideIndex === pin.placement.sideIndex
              ) {
                pin.placement.side = this.state.userDrag.placement.side;
                pin.placement.sideIndex = this.state.userDrag.placement.sideIndex;
              }
            }

            const wire = pin.connection;
            if (wire) {
              if (pin.type === "input") {
                wire.path.slice(-1)[0].x = Math.round(wire.path.slice(-1)[0].x);
                wire.path.slice(-1)[0].y = Math.round(wire.path.slice(-1)[0].y);
              } else {
                wire.path[0].x = Math.round(wire.path[0].x);
                wire.path[0].y = Math.round(wire.path[0].y);
              }
            }
            moveComponentPin(pin, undefined, undefined, this.state);
            this.state.userDrag = null;
          }
        }
      } else if (this.state.connectingWire) {
        if (this.state.connectingWire.path.length > 1) {
          const pos = this.state.connectingWire.path.slice(-1)[0];
          const wire = findWireByPos(pos.x, pos.y, this.state);
          if (wire && wire !== this.state.connectingWire) {
            this.state.wires.push(this.state.connectingWire);

            if (this.state.connectingWire.inputConnections.length > 0) {
              connectWires(
                this.state.connectingWire.inputConnections[0],
                this.state.connectingWire,
              );
              /*
						Give the intersection point to the wire with the highest index,
						so the intersection point is drawn
					  */
              if (
                this.state.wires.indexOf(this.state.connectingWire) >
                this.state.wires.indexOf(this.state.connectingWire.inputConnections[0])
              ) {
                this.state.connectingWire.intersections.push(
                  Object.assign(
                    {},
                    {
                      type: 0,
                      pos: this.state.connectingWire.path[0],
                    },
                  ),
                );
              } else {
                this.state.connectingWire.inputConnections[0].intersections.push(
                  Object.assign(
                    {},
                    {
                      type: 0,
                      pos: this.state.connectingWire.path[0],
                    },
                  ),
                );
              }
            }

            connectWires(this.state.connectingWire, wire);
          } else {
            const wires = findAllWiresInPos(null, null, this.state);

            if (wires.length > 1) {
              const wire1PathIndex = wires[0].path.findIndex(
                (coord) => coord.x === this.state.mouse.grid.x && this.state.mouse.grid.y,
              );
              if (wire1PathIndex) {
                const wire1Dx =
                  wires[0].path[wire1PathIndex].x - wires[0].path[wire1PathIndex + 1].x;
                if (wire1Dx !== 0) {
                  const tmp = wires[0];
                  wires[0] = wires[1];
                  wires[1] = tmp;
                }
              }

              if (wires.indexOf(wires[0]) > wires.indexOf(wires[1])) {
                if (
                  !wires[0].intersections.find(
                    (intersection) =>
                      intersection.pos.x === this.state.mouse.grid.x &&
                      intersection.pos.y === this.state.mouse.grid.y,
                  )
                ) {
                  wires[0].intersections.push({
                    type: 0,
                    pos: this.state.mouse.grid,
                  });
                }
              } else {
                if (
                  !wires[1].intersections.find(
                    (intersection) =>
                      intersection.pos.x === this.state.mouse.grid.x &&
                      intersection.pos.y === this.state.mouse.grid.y,
                  )
                ) {
                  wires[1].intersections.push({
                    type: 0,
                    pos: this.state.mouse.grid,
                  });
                }
              }

              if (
                wires[0].inputConnections.includes(wires[1]) &&
                wires[0].outputConnections.includes(wires[1])
              ) {
                // intersection type 1
                const inputIndex = wires[0].inputConnections.indexOf(wires[1]);
                if (inputIndex > -1) wires[0].inputConnections.splice(inputIndex, 1);
                const outputIndex = wires[1].outputConnections.indexOf(wires[0]);
                if (outputIndex > -1) wires[1].outputConnections.splice(outputIndex, 1);

                const intersection = wires[1].intersections.find(
                  (intersection) =>
                    intersection.pos.x === this.state.mouse.grid.x &&
                    intersection.pos.y === this.state.mouse.grid.y,
                );
                if (intersection) {
                  intersection.type = 1;
                }
              } else if (wires[1].inputConnections.includes(wires[0])) {
                // intersection type 2
                const inputIndex = wires[1].inputConnections.indexOf(wires[0]);
                if (inputIndex > -1) wires[1].inputConnections.splice(inputIndex, 1);
                const outputIndex = wires[0].outputConnections.indexOf(wires[1]);
                if (outputIndex > -1) wires[0].outputConnections.splice(outputIndex, 1);

                connectWires(wires[1], wires[0]);

                const intersection = wires[1].intersections.find(
                  (intersection) =>
                    intersection.pos.x === this.state.mouse.grid.x &&
                    intersection.pos.y === this.state.mouse.grid.y,
                );
                if (intersection) {
                  intersection.type = 2;
                }
              } else if (wires[1].outputConnections.includes(wires[0])) {
                const inputIndex = wires[0].inputConnections.indexOf(wires[1]);
                if (inputIndex > -1) wires[0].inputConnections.splice(inputIndex, 1);
                const outputIndex = wires[1].outputConnections.indexOf(wires[0]);
                if (outputIndex > -1) wires[1].outputConnections.splice(outputIndex, 1);

                const intersection = wires[1].intersections.findIndex(
                  (intersection) =>
                    intersection.pos.x === this.state.mouse.grid.x &&
                    intersection.pos.y === this.state.mouse.grid.y,
                );
                if (intersection > -1) {
                  wires[1].intersections.splice(intersection, 1);
                }
              } else {
                connectWires(wires[0], wires[1]);
                connectWires(wires[1], wires[0]);

                const intersection = wires[1].intersections.find(
                  (intersection) =>
                    intersection.pos.x === this.state.mouse.grid.x && this.state.mouse.grid.y,
                );
                if (intersection) {
                  intersection.type = 3;
                }
              }
            }
          }
          this.state.connectingWire = null;
        } else if (event.altKey) {
          this.state.scrollAnimation.animate = true;
        } else if (event.ctrlKey) {
          this.state.scrollAnimation.animate = true;
        } else {
          const component = findComponentByPos(null, null, this.state);
          if (component && "handleClick" in component) {
            (component as ClickableComponent).handleClick("mouseup");
          }
        }
      }
    } else if (event.buttons === MouseButton.MIDDLE) {
      this.state.scrollAnimation.animate = true;

      if (this.state.mouse.isMouseWheelClicked) {
        const component = findComponentByPos(null, null, this.state);
        if (component) selectComponent(component.constructor as AnyLogicComponentClass, this.state);
      }

      event.preventDefault();
      return;
    }
  }

  handleOnDblClick(event: MouseEvent) {
    this.state.mouse.screen.x = event.x;
    this.state.mouse.screen.y = event.y;
    this.state.mouse.grid.x = Math.round(event.x / this.state.zoom + this.state.offset.x);
    this.state.mouse.grid.y = Math.round(-event.y / this.state.zoom + this.state.offset.y);

    const component = findComponentByPos(null, null, this.state);
    if (event.buttons === MouseButton.LEFT && component && "open" in component) {
      component.open();
    }
  }

  handleOnMouseWheel(event: WheelEvent) {
    event.preventDefault();
    this.state.mouse.screen.x = event.x;
    this.state.mouse.screen.y = event.y;
    this.state.mouse.grid.x = Math.round(event.x / this.state.zoom + this.state.offset.x);
    this.state.mouse.grid.y = Math.round(-event.y / this.state.zoom + this.state.offset.y);
    this.state.zoomAnimation = Math.min(
      Math.max(
        this.state.zoomAnimation -
          (this.state.zoom / 8) * ((event.deltaX || event.deltaY) > 0 ? 0.5 : -1),
        2,
      ),
      300,
    );
  }
}
