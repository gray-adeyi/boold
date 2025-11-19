import InputComponent from "$/lib/logicComponents/InputComponent.svelte";
import type PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type Wire from "$/lib/logicComponents/Wire.svelte";
import type { ComponentPin, Coord } from "$/types";

type UserSelection = {
	pos: Coord;
	dimension: {
		width: number;
		height: number;
	};
	components: PrimitiveComponent[];
	wires: Wire[];
};

type UserDrag =
	| {
			isDragSelecting: boolean;
			pos: Coord;
			dx: number;
			dy: number;
	  }
	| {
			component: PrimitiveComponent;
			pos: Coord;
			dx: number;
			dy: number;
	  }
	| {
			pin: ComponentPin;
			pos: Coord;
	  };

export type BoardStoreState = {
	zoom: number;
	canvas: HTMLCanvasElement | null;
	canvasCtx: CanvasRenderingContext2D | null;
	audioCtx: AudioContext | null;
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
	scrollAnimation: {
		v: number;
		r: number;
		animate: boolean;
	};
	zoomAnimation: number;
	timerStart: Date | null;
	simulationFrameRate: number;
	lastFrameTimestamp: Date;
	isUserDragging: boolean;
	isUserSelecting: boolean;
	isUserConnecting: boolean;
	isMouseWheelClick: boolean;
	userSelection: UserSelection | null;
	userDrag: UserDrag | null;
	connectingWire: Wire | null;
	animationFrameId: number | null;
	selectedComponent: typeof PrimitiveComponent; // not to be confused with user selection
};

export const state: BoardStoreState = $state({
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
	isUserDragging: false,
	isUserSelecting: false,
	isUserConnecting: false,
	isMouseWheelClick: false,
	userSelection: null,
	userDrag: null,
	connectingWire: null,
	animationFrameId: null,
	selectedComponent: InputComponent,
});

export function scrollBoard(dx: number, dy: number) {
	if (state.settings.isScrollAnimationEnabled) {
		state.scrollAnimation.v = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) / 16;
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
	const { canvasCtx: ctx, canvas, zoom, offset } = state;
	if (!ctx || !canvas) return;

	// Clear the screen
	// ctx.clearRect(0,0, c.width, c.height)
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw grid points
	if (zoom > 24) {
		ctx.fillStyle = `rgba(200 200 200 / ${Math.min(1, zoom / 100)})`;
		for (let i = (-offset.x * zoom) % zoom; i < canvas.width; i += zoom) {
			for (let j = (offset.y * zoom) % zoom; j < canvas.height; j += zoom) {
				const a = zoom / 24;
				const b = zoom / 12;
				ctx.fillRect(i - a, j - a, b, b);
			}
		}
	}

	// For nice rounded edges
	ctx.lineJoin = zoom > 50 ? "round" : "miter";

	state.simulationFrameRate = 1000 / (new Date() - state.lastFrameTimestamp);
	state.lastFrameTimestamp = new Date();

	state.animationFrameId = requestAnimationFrame(drawBoardFrame);
}
