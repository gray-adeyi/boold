import { expect, test } from "vitest";
import ANDGateComponent from "$/lib/logicComponents/ANDGateComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";

const testBoardStoreState: BoardStoreState = {
  zoom: 100,
  canvas: null,
  canvasCtx: null,
  audioCtx: null,
  offset: { x: 0, y: 0 },
  mouse: {
    screen: { x: 0, y: 0 },
    grid: { x: 0, y: 0 },
  },
  components: [],
  wires: [],
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
  isUserConnecting: false,
  isMouseWheelClick: false,
  userSelection: null,
  userDrag: null,
  connectingWire: null,
  animationFrameId: null,
  componentInSelectionFocus: ANDGateComponent,
  updateQueue: [],
};

test("can instantiate ANDGateComponent", () => {
  const component = new ANDGateComponent(null, { x: 0, y: 0 }, testBoardStoreState);
  expect(component).toBeInstanceOf(ANDGateComponent);
});
