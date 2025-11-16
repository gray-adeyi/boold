<script lang="ts">
    import FloatingMenu from "$/views/workspace/floatingMenu/FloatingMenu.svelte";
    import Toolbar from "$/views/workspace/toolbar/Toolbar.svelte";

    let windowHeight = $state(0);
    let windowWidth = $state(0);

    function draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, windowWidth, windowHeight);
        requestAnimationFrame(() => draw(ctx));
    }

    function initCanvas(node: HTMLCanvasElement) {
        node.height = windowHeight;
        node.width = windowWidth;
        const ctx = node.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("Could not get canvas context");
        ctx.imageSmoothingEnabled = true;
        draw(ctx);
    }
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />
<div class="container">
    <canvas {@attach initCanvas}></canvas>
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
    
    .portal-target{
        position: relative;
        border: 2px solid green;
        width: 100%;
        height: 30px;
    }
</style>
