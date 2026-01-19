<script lang="ts">
import DialogPrimitive from "$/lib/components/DialogPrimitive.svelte";
import CanvasKeyboardEventManager from "$/lib/composable/CanvasKeyboardEventManager.svelte";
import CanvasMouseEventManager from "$/lib/composable/CanvasMouseEventManager.svelte";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import Wire from "$/lib/logicComponents/Wire.svelte";
import {
	state as boardStoreState,
	drawBoardFrame,
} from "$/stores/boardStore.svelte";
import ContextMenu from "$/views/board/components/ContextMenu.svelte";
import FloatingMenu from "$/views/board/components/floatingMenu/FloatingMenu.svelte";
import Toolbar from "$/views/board/components/toolbar/Toolbar.svelte";
import TutorialDrawer from "$/views/board/components/tutorial/TutorialDrawer.svelte";

let windowHeight = $state(0);
let windowWidth = $state(0);
const canvasMouseEventManager = new CanvasMouseEventManager(boardStoreState);
const canvasKeyboardEventManager = new CanvasKeyboardEventManager(
	boardStoreState,
);

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
    <canvas {@attach initCanvas} 
        tabindex="0"
        onmouseleave={(e) => canvasMouseEventManager.handleOnMouseLeave(e)}
        onmouseenter={(e) => canvasMouseEventManager.handleOnMouseEnter(e)}
        onmousedown={(e) => canvasMouseEventManager.handleOnMouseDown(e)}
        onmousemove={(e) => canvasMouseEventManager.handleOnMouseMove(e)}
        onmouseup={(e) => canvasMouseEventManager.handleOnMouseUp(e)}
        ondblclick={(e) => canvasMouseEventManager.handleOnDblClick(e)}
        onwheel={(e) =>canvasMouseEventManager.handleOnMouseWheel(e)}
        onkeydown={(e) => canvasKeyboardEventManager.handleOnKeydown(e)}
    ></canvas>
    <TutorialDrawer />
    <Toolbar />
    <FloatingMenu />
    <ContextMenu />
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
