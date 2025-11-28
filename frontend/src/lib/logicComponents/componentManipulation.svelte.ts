import CustomComponent from "$/lib/logicComponents/CustomComponent.svelte";
import Wire from "$/lib/logicComponents/Wire.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";
import type {
  AnyLogicComponent,
  AnyLogicComponentClass,
  BoardEntity,
  ComponentInputPin,
  ComponentOutputPin,
  ComponentPin,
  Coord,
  UserSelection,
  WireIntersection,
} from "$/types";

export function selectComponent(component: AnyLogicComponentClass,boardStoreState :BoardStoreState){
  boardStoreState.componentInSelectionFocus = component
}

/**
 * Adds the logic component to the board
 * @param component is the logic component to be added to the board
 * @param x is the x coordinate of where the component should be placed on the board
 * @param y is the y coordinate of where the component should be placed on the board
 * @param force
 *
 * @returns a flag indicating if adding the component to the board was successful
 */
export function addComponent(
  component: AnyLogicComponent,
  x: number = component.pos.x,
  y: number = component.pos.y,
  force: boolean = false,
  boardStoreState: BoardStoreState,
): boolean {
  if (
    (!findComponentPinByPos(x, y, boardStoreState) &&
      !findWireByPos(x, y, boardStoreState)) ||
    force
  ) {
    boardStoreState.components.push(component);
    return true;
  }
  return false;
}

export function addSelection(
  components: AnyLogicComponent[],
  wires: Wire[],
  selection: UserSelection | null,
  x: number | null,
  y: number | null,
  boardStoreState: BoardStoreState,
) {
  boardStoreState.components.push(...components);

  for (let i = 0; i < wires.length; i++) {
    const wire = wires[i];
    if (wire.to) {
      wire.to.connection = wire;
    }
    if (wire.from) {
      wire.from.connection = wire;

      const component = wire.from.component;
      boardStoreState.updateQueue.unshift(component.update.bind(component));
    }

    for (let i = 0; i < wire.inputConnections.length; i++) {
      connectWires(wire.inputConnections[i], wire);
    }

    for (let i = 0; i < wire.outputConnections.length; i++) {
      connectWires(wire, wire.outputConnections[i]);
    }
    boardStoreState.wires.push(wire);
  }

  if (selection) {
    if (!x) x = selection.pos.x;
    if (!y) y = selection.pos.x;
    boardStoreState.userSelection = Object.assign({}, selection);
    boardStoreState.userSelection.pos = { x, y };
    boardStoreState.userSelection.components = [...components];
    boardStoreState.userSelection.wires = [...wires];
    // TODO: Show context
  }
}

export function removeComponent(
  component: AnyLogicComponent,
  boardStoreState: BoardStoreState,
): {
  component: AnyLogicComponent;
  wires: Wire[];
} {
  const removedWires = [];
  for (let i = 0; i < component.inputPins.length; i++) {
    // Remove connections
    const wire = component.inputPins[i].connection;
    if (wire) {
      const removed = removeWire(wire, boardStoreState);
      removedWires.push(...removed);
    }
  }

  for (let i = 0; i < component.outputPins.length; i++) {
    // Remove connections
    const wire = component.outputPins[i].connection;
    if (wire) {
      const removed = removeWire(wire, boardStoreState);
      removedWires.push(...removed);
    }
  }

  // delete component.delay

  return {
    component,
    wires: removedWires,
  };
}

export function removeWire(
  wire: Wire,
  boardStoreState: BoardStoreState,
): Wire[] {
  const removedWires = [wire];
  const from = wire.from;
  const to = wire.to;

  if (from) {
    delete from.connection;
  }
  if (to) {
    delete to.connection;
    to.value = 0;
    to.component.update;
  }

  for (let i = 0; i < wire.inputConnections.length; i++) {
    const index = wire.inputConnections[i].outputConnections.indexOf(wire);
    if (index > -1) {
      wire.inputConnections[i].outputConnections.splice(index, 1);
      if (!wire.inputConnections[i].to) {
        const removed = removeWire(wire.inputConnections[i], boardStoreState);
        removedWires.push(...removed);
      }
    }
  }

  for (let i = 0; i < wire.outputConnections.length; i++) {
    const index = wire.outputConnections[i].inputConnections.indexOf(wire);
    if (index > -1) {
      wire.outputConnections[i].inputConnections.splice(index, 1);
      if (!wire.outputConnections[i].from) {
        const removed = removeWire(wire.outputConnections[i], boardStoreState);
        removedWires.push(...removed);
      }
    }
  }

  const index = boardStoreState.wires.indexOf(wire);
  if (index > -1) boardStoreState.wires.splice(index, 1);

  return removedWires;
}

export function removeSelection(
  components: AnyLogicComponent[],
  wires: Wire[],
  boardStoreState: BoardStoreState,
): {
  component: AnyLogicComponent[];
  wires: Wire[];
  userSelection: UserSelection | null;
} {
  const removedComponents = [];
  const removedWires = [];

  for (let i = 0; i < components.length; i++) {
    const removed = removeComponent(components[i], boardStoreState);
    removedComponents.push(removed.component);
    removedWires.push(...removed.wires);
  }

  const { userSelection } = boardStoreState;
  return {
    component: removedComponents,
    wires: removedWires,
    userSelection,
  };
}

export function connectComponents(
  from: ComponentOutputPin,
  to: ComponentInputPin,
  wire: Wire,
  boardStoreState: BoardStoreState,
) {
  to.connection = wire;
  wire.to = to;
  from.connection = wire;
  wire.from = from;
  boardStoreState.updateQueue.push(from.component.update.bind(from.component));
}

export function connectWires(wire1: Wire, wire2: Wire) {
  if (!wire1.outputConnections.includes(wire2)) {
    wire1.outputConnections.push(wire2);
  }

  if (!wire2.inputConnections.includes(wire1)) {
    wire2.inputConnections.push(wire1);
  }

  wire2.color = wire1.color;
  wire2.update(wire1.value);
}

export function changeComponentSize(
  component: AnyLogicComponent,
  width = component.width,
  height = component.height,
  boardStoreState: BoardStoreState,
) {
  const allPins = component.inputPins.concat(component.outputPins);
  if (2 * (height + width) < allPins.length) return;

  const oldPinsPlacements = allPins.map((pin) =>
    Object.assign({}, pin.placement),
  );
  const oldHeight = component.height;
  const oldWidth = component.width;

  component.height = height;
  component.width = width;

  for (let i = 0; i < allPins.length; i++) {
    const pin = allPins[i];
    if (
      (pin.placement.side % 2 === 1 && pin.placement.sideIndex > height - 1) ||
      (pin.placement.side % 2 === 0 && pin.placement.sideIndex > width - 1)
    ) {
      let side = pin.placement.side % 2 ? 2 : 1;
      let sideIndex = 0;
      if (pin.placement.side === 0 || pin.placement.side === 3) {
        sideIndex = 0;
      } else if (pin.placement.side === 1) {
        sideIndex = width - 1;
      } else if (pin.placement.side === 2) {
        sideIndex = height - 1;
      }

      const dir = pin.placement.side === 0 || pin.placement.side === 3 ? 1 : -1;

      while (findComponentPinInComponent(component, side, sideIndex)) {
        sideIndex += dir;
        if (sideIndex < 0) {
          side = (4 + (side - 1)) % 2;
          if (side % 2 === 1) {
            sideIndex = height - 1;
          } else {
            sideIndex = width - 1;
          }
        } else if (
          (side % 2 === 0 && sideIndex > width - 1) ||
          (side % 2 === 1 && sideIndex > height - 1)
        ) {
          side = (side + 1) % 4;
          sideIndex = 0;
        }
      }
      moveComponentPin(pin, side, sideIndex, boardStoreState);
    }
  }
}

export function moveComponent(
  component: AnyLogicComponent,
  x: number = component.pos.x,
  y: number = component.pos.y,
  boardStoreState: BoardStoreState,
) {
  const oldPos: Coord = Object.assign(
    {},
    boardStoreState.userDrag &&
      boardStoreState.userDrag?.component === component
      ? boardStoreState.userDrag.pos
      : component.pos,
  );

  const dx = x - oldPos.x;
  const dy = y - oldPos.y;

  component.pos.x = x;
  component.pos.y = y;

  const oldInputWirePos = [];
  for (let i = 0; i < component.inputPins.length; i++) {
    const wire = component.inputPins[i].connection;
    if (!wire) continue;
    const pos = wire.path.slice(-1)[0];
    pos.x = component.pos.x;
    pos.y = component.pos.y;
    const { placement } = component.inputPins[i];
    const angle = (Math.PI / 2) * placement.side;
    pos.x += Math.sin(angle);
    pos.y += Math.cos(angle);
    if (placement.side === 1) {
      pos.x += component.width - 1;
    } else if (placement.side === 2) {
      pos.y += component.height - 1;
    }

    if (placement.side % 2 === 0) {
      pos.x += placement.sideIndex;
    } else {
      pos.y -= placement.sideIndex;
    }

    let dx = wire.path.slice(-1)[0].x - wire.path.slice(-2)[0].x;
    const dy = wire.path.slice(-1)[0].y - wire.path.slice(-2)[0].y;

    const index = wire.path.findIndex((coord, idx) => {
      return (
        idx < wire.path.length - 1 &&
        coord.x === wire.path.slice(-1)[0].x &&
        coord.y === wire.path.slice(-1)[0].y
      );
    });

    if (index > -1) {
      wire.path.splice(index + 1, wire.path.length);
      continue;
    }

    while (Math.abs(dx) + Math.abs(dy) > 0) {
      let sdx = 0;
      let sdy = 0;
      if (Math.abs(dx) > Math.abs(dy)) {
        sdx = Math.sign(dx);
      } else {
        sdy = Math.sign(dy);
      }

      wire.path.splice(wire.path.length - 1, 0, {
        x: wire.path.slice(-2)[0].x + sdx,
        y: wire.path.slice(-2)[0].y + sdy,
      });
      dx = dy - sdx;
      dx = dy - sdy;
    }
  }

  const oldOutputWirePos = [];
  for (let i = 0; i < component.outputPins.length; i++) {
    const wire = component.outputPins[i].connection;
    if (!wire) continue;
    const pos = wire.path[0];
    pos.x = component.pos.x;
    pos.y = component.pos.y;
    const { placement } = component.outputPins[i];
    const angle = (Math.PI / 2) * placement.side;
    pos.x += Math.sin(angle);
    pos.y += Math.cos(angle);
    if (placement.side === 1) {
      pos.x += component.width - 1;
    } else if (placement.side === 2) {
      pos.y += component.height - 1;
    }

    if (placement.side % 2 === 0) {
      pos.x += placement.sideIndex;
    } else {
      pos.y -= placement.sideIndex;
    }

    let dx = wire.path.slice(-1)[0].x - wire.path.slice(-2)[0].x;
    const dy = wire.path.slice(-1)[0].y - wire.path.slice(-2)[0].y;

    const index = wire.path.findIndex((coord, idx) => {
      return (
        idx < wire.path.length - 1 &&
        coord.x === wire.path.slice(-1)[0].x &&
        coord.y === wire.path.slice(-1)[0].y
      );
    });

    if (index > -1) {
      wire.path.splice(index + 1, wire.path.length);
      continue;
    }

    while (Math.abs(dx) + Math.abs(dy) > 0) {
      let sdx = 0;
      let sdy = 0;
      if (Math.abs(dx) > Math.abs(dy)) {
        sdx = Math.sign(dx);
      } else {
        sdy = Math.sign(dy);
      }

      wire.path.splice(wire.path.length - 1, 0, {
        x: wire.path.slice(-2)[0].x + sdx,
        y: wire.path.slice(-2)[0].y + sdy,
      });
      dx = dy - sdx;
      dx = dy - sdy;
    }
  }
}

export function moveComponentPin(
  pin: ComponentPin,
  side: number = pin.placement.side,
  sideIndex: number = pin.placement.sideIndex,
  boardStoreState: BoardStoreState,
) {
  const oldSideIndex = Object.assign(
    {},
    boardStoreState.userDrag && boardStoreState.userDrag?.pin === pin
      ? boardStoreState.userDrag?.sideIndex
      : pin.placement.sideIndex,
  );
  pin.placement.side = side;
  pin.placement.sideIndex = sideIndex;
  const wire = pin.connection;
  if (!wire) return;
  const oldWirePath = [...wire.path];

  if (pin.type === "input") {
    const coord = wire.path.slice(-1)[0];
    coord.x = pin.component.pos.x;
    coord.y = pin.component.pos.y;
    const angle = (Math.PI / 2) * pin.placement.side;
    coord.x += Math.sin(angle);
    coord.y += Math.cos(angle);
    if (pin.placement.side === 1) {
      coord.x += pin.component.width - 1;
    } else if (pin.placement.side === 2) {
      coord.y -= pin.component.height - 1;
    }

    if (pin.placement.side % 2 === 0) {
      coord.x += pin.placement.sideIndex;
    } else {
      coord.y -= pin.placement.sideIndex;
    }

    const dx = wire.path.slice(-1)[0].x - wire.path.slice(-2)[0].x;
    const dy = wire.path.slice(-1)[0].y - wire.path.slice(-2)[0].y;

    const vertical = () => {
      const x = wire.path.slice(-2)[0].x;
      const y = wire.path.slice(-2)[0].y + Math.sign(dy);

      for (let i = 0; i < Math.abs(dy); i++) {
        wire.path.splice(wire.path.length - 1, 0, { x, y });
      }
    };

    const horizontal = () => {
      const x = wire.path.slice(-2)[0].x + Math.sign(dx);
      const y = wire.path.slice(-2)[0].y;

      for (let i = 0; i < Math.abs(dx); i++) {
        wire.path.splice(wire.path.length - 1, 0, { x, y });
      }
    };

    if (pin.placement.side % 2 === 0) {
      vertical();
      horizontal();
    } else {
      horizontal();
      vertical();
    }
  } else {
    const coord = wire.path[0];
    coord.x = pin.component.pos.x;
    coord.y = pin.component.pos.y;

    const angle = (Math.PI / 2) * pin.placement.side;
    coord.x += Math.sin(angle);
    coord.y += Math.cos(angle);
    if (pin.placement.side === 1) {
      coord.x += pin.component.width - 1;
    } else if (pin.placement.side === 2) {
      coord.y -= pin.component.height - 1;
    }

    if (pin.placement.side % 2 === 0) {
      coord.x += pin.placement.sideIndex;
    } else {
      coord.y -= pin.placement.sideIndex;
    }

    const dx = wire.path[0].x - wire.path[1].x;
    const dy = wire.path[0].y - wire.path[1].y;

    const vertical = () => {
      for (let i = 0; i < Math.abs(dy); i++) {
        const x = wire.path[1].x;
        const y = wire.path[1].y + Math.sign(dy);

        const index = wire.path.findIndex(
          (coord) => coord.x === x && coord.y === y,
        );
        if (index > -1) {
          wire.path.splice(0, index);
        } else {
          wire.path.splice(1, 0, { x, y });
        }
      }
    };

    const horizontal = () => {
      for (let i = 0; i < Math.abs(dx); i++) {
        const x = wire.path[1].x + Math.sign(dx);
        const y = wire.path[1].y;
        const index = wire.path.findIndex(
          (coord) => coord.x === x && coord.y === y,
        );
        if (index > -1) {
          wire.path.splice(0, index);
        } else {
          wire.path.splice(1, 0, { x, y });
        }
      }
    };

    if (pin.placement.side % 2 === 0) {
      vertical();
      horizontal();
    } else {
      horizontal();
      vertical();
    }
  }
}

export function moveSelection(
  components: AnyLogicComponent[],
  wires: Wire[],
  dx: number,
  dy: number,
  boardStoreState: BoardStoreState,
) {
  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    component.pos.x += dx;
    component.pos.y += dy;

    for (let i = 0; i < component.inputPins.length; i++) {
      const wire = component.inputPins[i].connection;
      if (wire && !wires.includes(wire)) {
        // FIXME: The next two lines don't really do anything,
        //  figure out what they should be doing
        wire.path.slice(-1)[0].x += dx;
        wire.path.slice(-1)[0].y += dy;
        let wdx = wire.path.slice(-1)[0].x - wire.path.slice(-2)[0].x;
        let wdy = wire.path.slice(-1)[0].y - wire.path.slice(-2)[0].y;

        const index = wire.path.findIndex(
          (coord) =>
            coord.x === wire.path.slice(-1)[0].x &&
            coord.y === wire.path.slice(-1)[0].y,
        );
        if (index > -1) {
          wire.path.splice(index + 1, wire.path.length);
          continue;
        }

        while (Math.abs(wdx) + Math.abs(wdy) > 0) {
          let sdx = 0;
          let sdy = 0;
          if (Math.abs(wdx) > Math.abs(wdy)) {
            sdx = Math.sign(wdx);
          } else {
            sdy = Math.sign(wdy);
          }

          wire.path.splice(wire.path.length - 1, 0, {
            x: wire.path.slice(-2)[0].x + sdx,
            y: wire.path.slice(-2)[0].y + sdy,
          });
          wdx = wdx - sdx;
          wdy = wdy - sdy;
        }
      }
    }

    for (let i = 0; i < component.outputPins.length; i++) {
      const wire = component.outputPins[i].connection;
      if (wire && !wires.includes(wire)) {
        wire.path[0].x += dx;
        wire.path[0].y += dy;
        let wdx = wire.path[0].x - wire.path[1].x;
        let wdy = wire.path[0].y - wire.path[1].y;

        const index = wire.path.findIndex(
          (coord) => coord.x === wire.path[0].x && coord.y === wire.path[0].y,
        );
        if (index > -1) {
          wire.path.splice(1, index);
          continue;
        }

        while (Math.abs(wdx) + Math.abs(wdy) > 0) {
          let sdx = 0;
          let sdy = 0;
          if (Math.abs(wdx) > Math.abs(wdy)) {
            sdx = Math.sign(wdx);
          } else {
            sdy = Math.sign(wdy);
          }

          wire.path.splice(1, 0, {
            x: wire.path[1].x + sdx,
            y: wire.path[1].y + sdy,
          });
          wdx = wdx - sdx;
          wdy = wdy - sdy;
        }
      }
    }
  }

  for (let i = 0; i < wires.length; i++) {
    const wire = wires[i];
    for (let j = 0; j < wire.path.length; j++) {
      wire.path[j].x += dx;
      wire.path[j].y += dy;
    }

    for (let j = 0; j < wire.intersections.length; j++) {
      wire.intersections[j].pos.x += dx;
      wire.intersections[j].pos.y += dy;
    }
  }

  if (boardStoreState.userSelection) {
    boardStoreState.userSelection.pos.x += dx;
    boardStoreState.userSelection.pos.y += dy;
    // TODO: Context menu
  }
}

export function editEntity(
  entity: BoardEntity,
  property: string,
  value: unknown,
) {
  if (
    Object.hasOwn(entity, property) &&
    typeof value === typeof entity[property]
  ) {
    entity[property] = value;
  }
}

/**
 * Finds a component by its position
 * @param param0 is the coordinate of the component you're looking for
 * @returns the component found at that position on the board if any otherwise
 *  returns undefined
 */
export function findComponentByPos(
  x: number | null = null,
  y: number | null = null,
  boardStoreState: BoardStoreState,
): AnyLogicComponent | undefined {
  if (!x) x = boardStoreState.mouse.grid.x;
  if (!y) y = boardStoreState.mouse.grid.y;
  for (let i = 0; i < boardStoreState.components.length; i++) {
    const component = boardStoreState.components[i];
    if (
      x >= component.pos.x &&
      x < component.pos.x + component.width &&
      y <= component.pos.y &&
      y > component.pos.y - component.height
    )
      return component;
  }
}

/**
 * Finds a compnent by its id
 * @param id is the unique identifier of the component you're looking for
 * @returns the component with the matching id if found, otherwise returns
 *  undefined
 */
export function findComponentById(
  id: string,
  boardStoreState: BoardStoreState,
): AnyLogicComponent | undefined {
  return boardStoreState.components.find((component) => component.id === id);
}

/**
 *  Finds a component by its name
 * @param name is the name of the component you're looking for
 * @returns the first component matching the name if found, otherwise returns
 *  undefined
 */
export function findComponentByName(
  name: string,
  boardStoreState: BoardStoreState,
): AnyLogicComponent | undefined {
  return boardStoreState.components.find(
    (component) => component.name === name,
  );
}

/**
 * Find a wire by its id
 * @param id is the unique identifier of the wire you're looking for
 * @returns the wire with the matching id if found, otherwise returns
 *  undefined
 */
export function findWireById(
  id: string,
  boardStoreState: BoardStoreState,
): Wire | undefined {
  return boardStoreState.wires.find((wire) => wire.id === id);
}

/**
 * Finds a wire by its position
 * @param param0 is the coordinate of the wire you're looking for
 * @returns the component found at that position on the board if any otherwise
 *  returns undefined
 */
export function findWireByPos(
  x: number | null = null,
  y: number | null = null,
  boardStoreState: BoardStoreState,
): Wire | undefined {
  if (!x) x = boardStoreState.mouse.grid.x;
  if (!y) y = boardStoreState.mouse.grid.y;
  for (let i = 0; i < boardStoreState.wires.length; i++) {
    const { path: pos } = boardStoreState.wires[i];
    for (let j = 0; j < pos.length; j++) {
      if (x === pos[j].x && y === pos[j].y) return boardStoreState.wires[i];
    }
  }
}

/**
 * Finds all wires in the coordinate provided
 * @param param0 is the coordinate where you want to find all the wires
 * @returns all the wires found in that coordinate if any.
 */
export function findAllWiresInPos(
  x: number | null = null,
  y: number | null = null,
  boardStoreState: BoardStoreState,
): Wire[] {
  if (!x) x = boardStoreState.mouse.grid.x;
  if (!y) y = boardStoreState.mouse.grid.y;
  const foundWires: Wire[] = [];
  for (let i = 0; i < boardStoreState.wires.length; i++) {
    const { path: pos } = boardStoreState.wires[i];
    for (let j = 0; j < pos.length; j++) {
      if (x === pos[j].x && y === pos[j].y) {
        foundWires.push(boardStoreState.wires[i]);
        break;
      }
    }
  }
  return foundWires;
}

/**
 * Find a pin of a component
 * @param component is the component in which you're looking for one of it's pins
 * @param side is the side of the component where the pin you're looking for is located,
 *  can be any of the values 0,1,2,3 where 0 = top, 1 = right, 2 = bottom and 3 = left.
 * @param sideIndex is the index of that pin in that side of the component 0 being the first
 *  pin on that side of the of the component. each side of the component may have a pin
 * with the same sideIndex
 */
export function findComponentPinInComponent(
  component: AnyLogicComponent,
  side: number,
  sideIndex: number,
): ComponentPin | undefined {
  const predicateFn = (pin: ComponentPin) =>
    pin.placement.side === side && pin.placement.sideIndex === sideIndex;
  return (
    component.inputPins.find(predicateFn) ||
    component.outputPins.find(predicateFn)
  );
}

/**
 * Find component pin by its coordinate
 * @param param0 is the coordinate where you want to find the component pin
 * @returns the component pin found at that position on the board if any otherwise
 *  returns undefined
 */
export function findComponentPinByPos(
  x: number | null = null,
  y: number | null = null,
  boardStoreState: BoardStoreState,
): ComponentPin | undefined {
  if (!x) x = boardStoreState.mouse.grid.x;
  if (!y) y = boardStoreState.mouse.grid.y;
  if (findComponentByPos(x, y, boardStoreState)) return;
  for (let i = 0; i < 4; i++) {
    const component = findComponentByPos(
      x - Math.round(Math.sin((Math.PI / 2) * 1)),
      y - Math.round(Math.cos((Math.PI / 2) * 1)),
      boardStoreState,
    );

    if (component) {
      const side = i;
      const sideIndex =
        side % 2 === 0 ? x - component.pos.x : component.pos.y - y;
      const found = findComponentPinInComponent(component, side, sideIndex);
      if (found) return found;
    }
  }
}

/**
 * Find a component pin by its identifier
 * @param id is the unique identifier of the component pin you're looking for
 * @returns the component pin with the matching id if found, otherwise returns
 *  undefined
 */
export function findComponentPinByID(
  id: string,
  boardStoreState: BoardStoreState,
): ComponentPin | undefined {
  for (let i = 0; i < boardStoreState.components.length; i++) {
    const predicateFn = (pin: ComponentPin) => pin.id === id;
    const found =
      boardStoreState.components[i].inputPins.find(predicateFn) ||
      boardStoreState.components[i].outputPins.find(predicateFn);
    if (found) return found;
  }
}

/**
 * Find all components inside a user selection
 * @param param0 is the info of the user selection
 * @returns all components found in the user selection if any
 */
export function findComponentsInUserSelection(
  x: number | null = null,
  y: number | null = null,
  width: number | null = null,
  height: number | null = null,
  boardStoreState: BoardStoreState,
): AnyLogicComponent[] {
  // userSelection should be available when the fn is called
  if (!x) x = boardStoreState.userSelection?.pos.x || 0;
  if (!y) y = boardStoreState.userSelection?.pos.y || 0;
  if (!width) width = boardStoreState.userSelection?.dimension.width || 0;
  if (!height) height = boardStoreState.userSelection?.dimension.height || 0;
  const x2 = Math.max(x, x + width);
  const y2 = Math.max(y, y + height);
  x = Math.min(x, x + width);
  y = Math.min(y, y + height);

  const result: AnyLogicComponent[] = [];
  for (let i = 0; i < boardStoreState.components.length; i++) {
    const component = boardStoreState.components[i];
    if (
      x < component.pos.x + (component.width || 0) - 0.5 &&
      x2 > component.pos.x - 0.5 &&
      y2 > component.pos.y - (component.height || 0) + 0.5 &&
      y < component.pos.y + 0.5
    ) {
      result.push(component);
    }
  }
  return result;
}
/**
 * Finds all wires inside a user selection
 * @param param0 is the info about the user selection
 * @returns all wires found in the selection if any.
 */
export function findWiresInUserSelection(
  x: number | null = null,
  y: number | null = null,
  width: number | null = null,
  height: number | null = null,
  boardStoreState: BoardStoreState,
): Wire[] {
  // userSelection should be available when the fn is called
  if (!x) x = boardStoreState.userSelection?.pos.x || 0;
  if (!y) y = boardStoreState.userSelection?.pos.y || 0;
  if (!width) width = boardStoreState.userSelection?.dimension.width || 0;
  if (!height) height = boardStoreState.userSelection?.dimension.height || 0;
  const x2 = Math.max(x, x + width);
  const y2 = Math.max(y, y + height);
  x = Math.min(x, x + width);
  y = Math.min(y, y + height);
  const result: Wire[] = [];
  for (let i = 0; i < boardStoreState.wires.length; i++) {
    const { path } = boardStoreState.wires[i];
    for (let j = 0; j < path.length; j++) {
      if (
        path[j].x >= x &&
        path[j].x <= x2 &&
        path[j].y >= y &&
        path[j].y <= y2
      ) {
        result.push(boardStoreState.wires[i]);
        break;
      }
    }
  }

  return result;
}

/**
 * Finds all the wires in a user selection without connections
 * @param param0 is the info about the user selection
 * @returns all the wires without connection if any
 */
export function findAllWiresInSelectionWithoutConnections(
  x: number | null = null,
  y: number | null = null,
  width: number | null = null,
  height: number | null = null,
  boardStoreState: BoardStoreState,
): Wire[] {
  // userSelection should be available when the fn is called
  if (!x) x = boardStoreState.userSelection?.pos.x || 0;
  if (!y) y = boardStoreState.userSelection?.pos.y || 0;
  if (!width) width = boardStoreState.userSelection?.dimension.width || 0;
  if (!height) height = boardStoreState.userSelection?.dimension.height || 0;
  const result = findWiresInUserSelection(x, y, width, height, boardStoreState);

  for (let i = 0; i < result.length; i++) {
    const wire = result[i];

    if (
      wire?.from?.component &&
      !boardStoreState.components.includes(wire.from.component)
    ) {
      result.splice(i, 1);
      i = -1;
      continue;
    }

    if (
      wire?.to?.component &&
      !boardStoreState.components.includes(wire.to.component)
    ) {
      result.splice(i, 1);
      i = -1;
      continue;
    }

    for (let i = 0; i < wire.inputConnections.length; i++) {
      if (!result.includes(wire.inputConnections[i])) {
        wire.inputConnections.splice(i, 1);
      }
    }

    for (let i = 0; i < wire.outputConnections.length; i++) {
      if (!result.includes(wire.outputConnections[i])) {
        wire.outputConnections.splice(i, 1);
      }
    }

    if (!wire.from && wire.inputConnections.length < 1) {
      result.splice(i, 1);
      i = -1;
      continue;
    }

    if (!wire.to && wire.outputConnections.length < 1) {
      result.splice(i, 1);
      i = -1;
    }
  }
  return result;
} /**
 * Creates a clone of the component to and positions it (dx,dy) from the original
 * @param component is the component to cloned
 * @param dx is the x coordinate from the original component
 * @param dy is the y coordinate from the original component
 * @returns the cloned component
 */
export function cloneComponent(
  component: AnyLogicComponent,
  dx: number = 0,
  dy: number = 0,
  boardStoreState: BoardStoreState,
): AnyLogicComponent {
  const clone: AnyLogicComponent = component.constructor();
  clone.pos = {
    x: component.pos.x + dx,
    y: component.pos.y + dy,
  };
  clone.name = component.name;
  if (clone.name.includes(`${clone.constructor.name}#`)) {
    const autoNamedComponentsCount = boardStoreState.components.filter((c) =>
      c.name.includes(`${clone.constructor.name}#`),
    ).length;
    clone.name = `${clone.constructor.name}#${autoNamedComponentsCount + 1}`;
  } else {
    const clonesCount = boardStoreState.components.filter((c) =>
      c.name.includes(`${clone.name}#`),
    ).length;
    const baseName = clone.name.includes("#")
      ? clone.name.split("#")[0]
      : clone.name;
    clone.name = `${baseName}#${clonesCount + 1}`;
  }
  clone.width = component.width;
  clone.height = component.height;
  clone.rotation = component.rotation;
  if (Object.hasOwn(component, "value")) clone.value = component.value;
  clone.properties = Object.assign({}, component.properties);

  if (component.constructor === CustomComponent) {
    const inner = cloneSelection(
      component.components,
      component.wires,
      undefined,
      undefined,
      boardStoreState,
    );
    clone.components = inner.components;
    clone.wires = inner.wires;
    clone.inputPins = [];
    clone.outputPins = [];
    clone.create();
    clone.height = component.height;
    clone.width = component.width;
  }
  cloneComponentPins(component, clone, boardStoreState);
  return clone;
}

/**
 * Clones the pins on the source component to the clone component
 * @param component is the source where you want to copy the pins from
 * @param clone is the component where you want the clone pin to be
 */
function cloneComponentPins(
  component: AnyLogicComponent,
  clone: AnyLogicComponent,
  boardStoreState: BoardStoreState,
) {
  clone.inputPins = [];
  for (let i = 0; i < component.inputPins.length; i++) {
    const pin = clone.addInputPin({ side: 0, sideIndex: 0 }, "");
    pin.name = component.inputPins[i].name;
    pin.value = component.inputPins[i].value;
    pin.placement = Object.assign({}, component.inputPins[i].placement);
  }

  clone.outputPins = [];
  for (let i = 0; i < component.outputPins.length; i++) {
    const pin = clone.addInputPin({ side: 0, sideIndex: 0 }, "");
    pin.name = component.outputPins[i].name;
    pin.value = component.outputPins[i].value;
    pin.placement = Object.assign({}, component.outputPins[i].placement);
  }
}

/**
 * Clone a wire
 * @param wire is the wire to be cloned
 * @param dx is the x coordinate where the cloned wire should be placed
 * @param dy is the y coordinate where the cloned wire should be placed
 * @returns the cloned wire
 */
export function cloneWire(
  wire: Wire,
  dx: number = 0,
  dy: number = 0,
  boardStoreState: BoardStoreState,
): Wire {
  const newPath = wire.path.map((coord) => {
    return { x: coord.x + dx, y: coord.y + dy };
  });
  const newIntersections: WireIntersection[] = wire.intersections.map(
    (intersection) => {
      return {
        pos: { x: intersection.pos.x + dx, y: intersection.pos.y + dy },
        type: intersection.type,
      };
    },
  );
  const clone = new Wire(
    newPath,
    newIntersections,
    wire.color,
    undefined,
    undefined,
    boardStoreState,
  );
  clone.value = wire.value;
  return clone;
}

export function cloneSelection(
  components: AnyLogicComponent[] = [],
  wires: Wire[] = [],
  dx: number = 0,
  dy: number = 0,
  boardStoreState: BoardStoreState,
): {
  components: AnyLogicComponent[];
  wires: Wire[];
} {
  // prevent modifying origin
  wires = [...wires];

  const clonedComponents = components.map((component) =>
    cloneComponent(component, dx, dy, boardStoreState),
  );
  const clonedWires: Wire[] = [];

  return {
    components: clonedComponents,
    wires: clonedWires,
  };
}

export function componentize(
  components: AnyLogicComponent[],
  wires: Wire[],
  userSelection: UserSelection | null = null,
  x: number | null = null,
  y: number | null = null,
  boardStoreState: BoardStoreState,
) {
  if (!userSelection) userSelection = boardStoreState.userSelection;
  if (!x) x = boardStoreState.mouse.grid.x;
  if (!y) y = boardStoreState.mouse.grid.y;
  const component = new CustomComponent(
    null,
    { x, y },
    undefined,
    undefined,
    null,
    boardStoreState,
  );
  const clone = cloneSelection(
    components,
    wires,
    undefined,
    undefined,
    boardStoreState,
  );
  component.components = clone.components;
  component.wires = clone.wires;
  component.create();
  userSelection = Object.assign({ components: [], wires: [] }, userSelection);
  removeSelection(
    userSelection.components,
    userSelection.wires,
    boardStoreState,
  );
  boardStoreState.components.push(component);
}
