import ANDGateComponent from "$/lib/logicComponents/ANDGateComponent.svelte";
import {
  addSelection,
  cloneComponent,
  cloneSelection,
} from "$/lib/logicComponents/componentManipulation.svelte";
import type Wire from "$/lib/logicComponents/Wire.svelte";
import type {
  AnyLogicComponent,
  AnyLogicComponentClass,
  ComponentPin,
  ComponentPinPlacement,
  Coord,
  UserSelection,
} from "$/types";

type UserDrag =
  | {
      isDragSelecting: boolean;
      pos: Coord;
      dx: number;
      dy: number;
    }
  | {
      component: AnyLogicComponent;
      pos: Coord;
      dx: number;
      dy: number;
    }
  | {
      pin: ComponentPin;
      placement: ComponentPinPlacement;
    };

export type BoardStoreState = {
  zoom: number;
  canvas: HTMLCanvasElement | null;
  canvasCtx: CanvasRenderingContext2D | null;
  audioCtx: AudioContext | null;
  offset: Coord;
  mouse: {
    isMouseWheelClicked: boolean;
    screen: Coord;
    grid: Coord;
  };
  components: AnyLogicComponent[];
  wires: Wire[];
  clipboard: {
    components: AnyLogicComponent[];
    wires: Wire[];
    userSelection: UserSelection | null;
  };
  settings: {
    isScrollAnimationEnabled: boolean;
    isZoomAnimationEnabled: boolean;
    isShowDebugInfoEnabled: boolean;
    isVisualizeComponentUpdatesEnabled: boolean;
    isShowComponentUpdatesEnabled: boolean;
  };
  scrollAnimation: {
    v: number;
    r: number;
    animate: boolean;
  };
  zoomAnimation: number;
  timerStart: Date | null;
  simulationFrameRate: number;
  lastFrameTimestamp: Date;
  isMouseWheelClick: boolean;
  userSelection: UserSelection | null;
  userDrag: UserDrag | null;
  connectingWire: Wire | null;
  animationFrameId: number | null;
  componentClassInSelectionFocus: AnyLogicComponentClass; // type of any logic component not just InputComponent
  updateQueue: (() => void)[];
  isTutorialDrawerOpen: boolean;
  contextMenu: {
    isVisible: boolean;
    pos: Coord;
  };
};

export const state: BoardStoreState = $state({
  zoom: 100,
  canvas: null,
  canvasCtx: null,
  audioCtx: null,
  offset: { x: 0, y: 0 },
  mouse: {
    isMouseWheelClicked: false,
    screen: { x: 0, y: 0 },
    grid: { x: 0, y: 0 },
  },
  components: [],
  wires: [],
  clipboard: {
    components: [],
    wires: [],
    userSelection: null,
  },
  settings: {
    isScrollAnimationEnabled: true,
    isZoomAnimationEnabled: true,
    isShowDebugInfoEnabled: false,
    isVisualizeComponentUpdatesEnabled: false,
    isShowComponentUpdatesEnabled: false,
  },
  scrollAnimation: { v: 0, r: 0, animate: false },
  zoomAnimation: 100,
  timerStart: null,
  simulationFrameRate: 60,
  lastFrameTimestamp: new Date(),
  isMouseWheelClick: false,
  userSelection: null,
  userDrag: null,
  connectingWire: null,
  animationFrameId: null,
  componentClassInSelectionFocus: ANDGateComponent,
  updateQueue: [],
  isTutorialDrawerOpen: false,
  contextMenu: {
    isVisible: false,
    pos: { x: 0, y: 0 },
  },
});

export function scrollBoard(dx: number, dy: number) {
  if (state.settings.isScrollAnimationEnabled) {
    state.scrollAnimation.v = Math.sqrt(dx ** 2 + dy ** 2) / 16;
    state.scrollAnimation.r = Math.atan2(-dx, dy);
    state.scrollAnimation.animate = true;
  } else {
    state.offset.x += dx;
    state.offset.y += dy;
  }
  state.mouse.grid.x += dx;
  state.mouse.grid.y += dy;
}

export function changeBoardZoom(dz: number) {
  state.zoomAnimation = Math.min(Math.max(state.zoomAnimation + dz, 2), 300);
}

export function drawBoardFrame() {
  if (!state.canvasCtx || !state.canvas) return;

  // Clear the screen
  // ctx.clearRect(0,0, c.width, c.height)
  state.canvasCtx.fillStyle = "#fff";
  state.canvasCtx.fillRect(0, 0, state.canvas.width, state.canvas.height);

  // Draw grid points
  if (state.zoom > 24) {
    state.canvasCtx.fillStyle = `rgba(200 200 200 / ${Math.min(1, state.zoom / 100)})`;
    for (
      let i = (-state.offset.x * state.zoom) % state.zoom;
      i < state.canvas.width;
      i += state.zoom
    ) {
      for (
        let j = (state.offset.y * state.zoom) % state.zoom;
        j < state.canvas.height;
        j += state.zoom
      ) {
        const a = state.zoom / 24;
        const b = state.zoom / 12;
        state.canvasCtx.fillRect(i - a, j - a, b, b);
      }
    }
  }

  // For nice rounded edges
  state.canvasCtx.lineJoin = state.zoom > 50 ? "round" : "miter";

  // Draw wires
  state.canvasCtx.lineWidth = state.zoom < 20 ? 1 : Math.round(state.zoom / 8);

  // Draw connecting wires
  if (state.connectingWire) state.connectingWire.draw();

  for (let i = 0; i < state.wires.length; i++) {
    state.wires[i].draw();
  }

  state.canvasCtx.lineCap = "butt";

  // Draw components
  for (let i = 0; i < state.components.length; i++) {
    state.components[i].draw();
  }

  // Draw selections
  if (state.userSelection) {
    state.canvasCtx.fillStyle = "rgba(0 90 180 / .1)";
    state.canvasCtx.strokeStyle = "rgba(0 90 180 / 1";
    state.canvasCtx.setLineDash([10, 5]);
    state.canvasCtx.lineDashOffset = state.userSelection.dashOffset++;
    state.canvasCtx.lineWidth = 2;

    state.canvasCtx.beginPath();
    state.canvasCtx.rect(
      (state.userSelection.pos.x - state.offset.x) * state.zoom,
      (-state.userSelection.pos.y + state.offset.y) * state.zoom,
      state.userSelection.dimension.width * state.zoom,
      -state.userSelection.dimension.height * state.zoom,
    );
    state.canvasCtx.fill();
    state.canvasCtx.stroke();
    state.canvasCtx.setLineDash([0, 0]);
  }

  // Scroll animation
  if (state.settings.isScrollAnimationEnabled && state.scrollAnimation.animate) {
    state.offset.x -= Math.sin(state.scrollAnimation.r) * state.scrollAnimation.v;
    state.offset.y += Math.cos(state.scrollAnimation.r) * state.scrollAnimation.v;
    state.scrollAnimation.v -= state.scrollAnimation.v / 16;
    if (state.scrollAnimation.v <= 0.001) {
      state.scrollAnimation.animate = false;
    }
  }

  // Zoom animation
  if (state.settings.isZoomAnimationEnabled) {
    state.offset.x +=
      state.mouse.screen.x * (1 / state.zoom - 8 / (state.zoomAnimation + 7 * state.zoom));
    state.offset.y -=
      state.mouse.screen.y * (1 / state.zoom - 8 / (state.zoomAnimation + 7 * state.zoom));
    state.zoom = state.zoom - (state.zoom - state.zoomAnimation) / 8;
  } else {
    state.offset.x =
      state.offset.x + state.mouse.screen.x * (1 / state.zoom - 1 / state.zoomAnimation);
    state.offset.y =
      state.offset.y - state.mouse.screen.y * (1 / state.zoom - 1 / state.zoomAnimation);
    state.zoom = state.zoomAnimation;
  }

  state.simulationFrameRate = 1000 / (new Date().getTime() - state.lastFrameTimestamp.getTime());
  state.lastFrameTimestamp = new Date();

  state.animationFrameId = requestAnimationFrame(drawBoardFrame);
}

export function toggleTutorialDrawer() {
  state.isTutorialDrawerOpen = !state.isTutorialDrawerOpen;
}

export function copyToClipboard(
  components: AnyLogicComponent[],
  wires: Wire[],
  userSelection: UserSelection | null,
) {
  const clone = cloneSelection(components, wires, undefined, undefined, state);
  state.clipboard.components = clone.components;
  state.clipboard.wires = clone.wires;
  if (userSelection) {
    state.clipboard.userSelection = Object.assign({}, userSelection);
  } else {
    state.clipboard.userSelection = null;
  }
}

export function pasteFromClipboard(x: number, y: number) {
  if (state.clipboard.userSelection) {
    const dx = Math.round(x - state.clipboard.userSelection.pos.x) || 0;
    const dy = Math.round(y - state.clipboard.userSelection.pos.y) || 0;

    const clone = cloneSelection(state.clipboard.components, state.clipboard.wires, dx, dy, state);
    addSelection(clone.components, clone.wires, state.clipboard.userSelection, x, y, state);
  } else if (state.clipboard.components.length > 0) {
    const clone = cloneComponent(state.clipboard.components[0], undefined, undefined, state);
    clone.pos.x = x;
    clone.pos.y = y;
    state.components.push(clone);
  }
}

export function showContextMenu(pos: Coord) {
  if (state.userDrag || state.connectingWire) return;
  state.contextMenu.pos = pos;
  state.contextMenu.isVisible = true;
}

export function hideContextMenu() {
  state.contextMenu.isVisible = false;
}
