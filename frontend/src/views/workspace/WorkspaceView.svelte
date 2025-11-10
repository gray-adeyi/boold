<script lang="ts">
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
<canvas {@attach initCanvas}></canvas>


<style>
    canvas{
        cursor: crosshair;
    }
</style>