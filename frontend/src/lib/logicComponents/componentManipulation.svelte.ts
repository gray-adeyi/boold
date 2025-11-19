import type PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import { state as boardStoreState } from "$/stores/boardStore.svelte";
import type {
  ComponentInputPin,
  ComponentOutputPin,
  ComponentPin,
  Coord,
} from "$/types";
import Wire from "$/lib/logicComponents/Wire.svelte";
import CustomComponent from "$/lib/logicComponents/CustomComponent.svelte";

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
  component: PrimitiveComponent,
  x: number = component.pos.x,
  y: number = component.pos.y,
  force: boolean = false,
): boolean {
  if ((!findComponentPinByPos({ x, y }) && !findWireByPos({ x, y })) || force) {
    boardStoreState.components.push(component);
    return true;
  }
  return false;
}

export function addSelection() {}

export function removeComponent() {}

export function removeSelection() {}

export function connectComponents(
  from: ComponentOutputPin,
  to: ComponentInputPin,
) {}

export function connectWires(wire1: Wire, wire2: Wire) {}

export function changeComponentSize() {}

export function moveComponent() {}

export function moveComponentPin() {}

export function moveSelection() {}

export function editEntity() {}

/**
 * Finds a component by its position
 * @param param0 is the coordinate of the component you're looking for
 * @returns the component found at that position on the board if any otherwise
 *  returns undefined
 */
export function findComponentByPos({
  x = boardStoreState.mouse.grid.x,
  y = boardStoreState.mouse.grid.y,
}: Coord): PrimitiveComponent | undefined {
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
export function findComponentById(id: string): PrimitiveComponent | undefined {
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
): PrimitiveComponent | undefined {
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
export function findWireById(id: string): Wire | undefined {
  return boardStoreState.wires.find((wire) => wire.id === id);
}

/**
 * Finds a wire by its position
 * @param param0 is the coordinate of the wire you're looking for
 * @returns the component found at that position on the board if any otherwise
 *  returns undefined
 */
export function findWireByPos({
  x = boardStoreState.mouse.grid.x,
  y = boardStoreState.mouse.grid.y,
}: Coord): Wire | undefined {
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
export function findAllWiresInPos({
  x = boardStoreState.mouse.grid.x,
  y = boardStoreState.mouse.grid.y,
}: Coord): Wire[] {
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
 * @param pinIndex is the index of that pin in that side of the component 0 being the first
 *  pin on that side of the of the component. each side of the component may have a pin
 * with the same pinIndex
 */
export function findComponentPinInComponent(
  component: PrimitiveComponent,
  side: number,
  pinIndex: number,
): ComponentPin | undefined {
  const predicateFn = (pin: ComponentPin) =>
    pin.placement.side === side && pin.placement.pinIndex === pinIndex;
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
export function findComponentPinByPos({
  x = boardStoreState.mouse.grid.x,
  y = boardStoreState.mouse.grid.y,
}: Coord): ComponentPin | undefined {
  if (findComponentByPos({ x, y })) return;
  for (let i = 0; i < 4; i++) {
    const component = findComponentByPos({
      x: x - Math.round(Math.sin((Math.PI / 2) * 1)),
      y: y - Math.round(Math.cos((Math.PI / 2) * 1)),
    });

    if (component) {
      const side = i;
      const pinIndex =
        side % 2 === 0 ? x - component.pos.x : component.pos.y - y;
      const found = findComponentPinInComponent(component, side, pinIndex);
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
export function findComponentPinByID(id: string): ComponentPin | undefined {
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
export function findComponentsInUserSelection({
  pos: {
    x = boardStoreState.userSelection.pos.x,
    y = boardStoreState.userSelection.pos.y,
  },
  dimension: {
    width = boardStoreState.userSelection.dimension.width,
    height = boardStoreState.userSelection.dimension.height,
  },
}: {
  pos: Coord;
  dimension: { width: number; height: number };
}): PrimitiveComponent[] {
  const x2 = Math.max(x, x + width);
  const y2 = Math.max(y, y + height);
  x = Math.min(x, x + width);
  y = Math.min(y, y + height);

  const result: PrimitiveComponent[] = [];
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
export function findWiresInUserSelection({
  pos: {
    x = boardStoreState.userSelection.pos.x,
    y = boardStoreState.userSelection.pos.y,
  },
  dimension: {
    width = boardStoreState.userSelection.dimension.width,
    height = boardStoreState.userSelection.dimension.height,
  },
}: {
  pos: Coord;
  dimension: { width: number; height: number };
}): Wire[] {
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
export function findAllWiresInSelectionWithoutConnections({
  pos: {
    x = boardStoreState.userSelection.pos.x,
    y = boardStoreState.userSelection.pos.y,
  },
  dimension: {
    width = boardStoreState.userSelection.dimension.width,
    height = boardStoreState.userSelection.dimension.height,
  },
}: {
  pos: Coord;
  dimension: { width: number; height: number };
}): Wire[] {
  const result = findWiresInUserSelection({
    pos: { x, y },
    dimension: { width, height },
  });

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
  component: PrimitiveComponent,
  dx: number = 0,
  dy: number = 0,
): PrimitiveComponent {
  const clone: PrimitiveComponent = component.constructor();
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
  if (component.hasOwnProperty("value")) clone.value = component.value;
  clone.properties = Object.assign({}, component.properties);

  if (component.constructor === CustomComponent) {
    const inner = cloneSelection(component.components, component.wires);
    clone.components = inner.components;
    clone.wires = inner.wires;
    clone.inputPins = [];
    clone.outputPins = [];
    clone.create();
    clone.height = component.height;
    clone.width = component.width;
  }
  cloneComponentPins(component, clone);
  return clone;
}

/**
 * Clones the pins on the source component to the clone component
 * @param component is the source where you want to copy the pins from
 * @param clone is the component where you want the clone pin to be
 */
function cloneComponentPins(
  component: PrimitiveComponent,
  clone: PrimitiveComponent,
) {
  clone.inputPins = [];
  for (let i = 0; i < component.inputPins.length; i++) {
    const pin = clone.addInputPin({ side: 0, pinIndex: 0 }, "");
    pin.name = component.inputPins[i].name;
    pin.value = component.inputPins[i].value;
    pin.placement = Object.assign({}, component.inputPins[i].placement);
  }

  clone.outputPins = [];
  for (let i = 0; i < component.outputPins.length; i++) {
    const pin = clone.addInputPin({ side: 0, pinIndex: 0 }, "");
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
export function cloneWire(wire: Wire, dx: number = 0, dy: number = 0): Wire {
  const newPath = wire.path.map((coord) => {
    return { x: coord.x + dx, y: coord.y + dy };
  });
  const newIntersections = wire.intersections.map((intersection) => {
    return { x: intersection.x + dx, y: intersection.y + dy };
  });
  const clone = new Wire(
    newPath,
    newIntersections,
    wire.color,
    undefined,
    undefined,
  );
  clone.value = wire.value;
  return clone;
}

export function cloneSelection(
  components: PrimitiveComponent[] = [],
  wires: PrimitiveComponent[] = [],
  dx: number = 0,
  dy: number = 0,
): {
  components: PrimitiveComponent[];
  wires: Wire[];
} {
  // prevent modifying origin
  wires = [...wires];

  const clonedComponents = components.map((component) =>
    cloneComponent(component, dx, dy),
  );
  const clonedWires: Wire[] = [];

  return {
    components: clonedComponents,
    wires: clonedWires,
  };
}

export function componentize() {}
