<script lang="ts">
import DialogPrimitive from "$/lib/components/DialogPrimitive.svelte";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import Wire from "$/lib/logicComponents/Wire.svelte";
import FloatingMenu from "$/views/board/floatingMenu/FloatingMenu.svelte";
import Toolbar from "$/views/board/toolbar/Toolbar.svelte";
import TutorialDrawer from "$/views/board/tutorial/TutorialDrawer.svelte";
import {
	state as boardStoreState,
	drawBoardFrame,
} from "$/stores/boardStore.svelte";

let windowHeight = $state(0);
let windowWidth = $state(0);

function initCanvas(node: HTMLCanvasElement) {
	node.height = windowHeight;
	node.width = windowWidth;
	const ctx = node.getContext("2d", { alpha: false });
	if (!ctx) throw new Error("Could not get canvas context");
	ctx.imageSmoothingEnabled = true;
	boardStoreState.canvas = node;
	boardStoreState.canvasCtx = ctx;
	boardStoreState.audioCtx = new AudioContext();
	boardStoreState.animationFrameId = requestAnimationFrame(drawBoardFrame);
	return () => {
		if (boardStoreState.animationFrameId) {
			cancelAnimationFrame(boardStoreState.animationFrameId);
		}
		if (boardStoreState.audioCtx) {
			boardStoreState.audioCtx.close();
			boardStoreState.audioCtx = null;
		}
		boardStoreState.canvas = null;
		boardStoreState.canvasCtx = null;
	};
}
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />
<div class="container">
    <canvas {@attach initCanvas}></canvas>
    <TutorialDrawer />
    <Toolbar />
    <FloatingMenu />
    <div class="portal-target" id="workspace-portal-target"></div>
</div>

<style>
    canvas {
        cursor: crosshair;
    }

    .container {
        position: relative;
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .portal-target {
        position: relative;
        border: 2px solid green;
        width: 100%;
        height: 30px;
    }
</style>
