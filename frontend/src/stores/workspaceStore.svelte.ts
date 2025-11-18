import type PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type Wire from "$/lib/logicComponents/Wire.svelte";
import type { Coord } from "$/types";

export type WorkspaceStoreState = {
  zoom: number;
  canvas: HTMLCanvasElement | null;
  canvasCtx: CanvasRenderingContext2D | null;
  offset: Coord;
  mouse: {
    screen: Coord;
    grid: Coord;
  };
  components: PrimitiveComponent[];
  wires: Wire[];
  settings: {
    isScrollAnimationEnabled: boolean;
    isZoomAnimationEnabled: boolean;
    isShowDebugInfoEnabled: boolean;
    isVisualizeComponentUpdatesEnabled: boolean;
    isShowComponentUpdatesEnabled: boolean;
  };
  timerStart: Date | null;
};

export const state: WorkspaceStoreState = $state({
  zoom: 100,
  canvas: null,
  canvasCtx: null,
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
    isShowComponentUpdatesEnabled: false
  },
  timerStart: null,
});
