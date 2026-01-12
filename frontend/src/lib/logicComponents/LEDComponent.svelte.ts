import type { Coord, RGBColor } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";

export default class LEDComponent extends PrimitiveComponent {
  private color: RGBColor;
  constructor(
    name: string | null,
    pos: Coord,
    boardStoreState: BoardStoreState,
    color: RGBColor = { r: 100, g: 0, b: 0 },
  ) {
    super(name, pos, 1, 1, { type: "value" }, boardStoreState);
    this.addInputPin({ side: 3, sideIndex: 0 }, "IN");
    this.value = 0;
    this.color = color;
  }

  execute(): void {
    this.value = this.inputPins[0].value;
  }

  draw() {
    const { offset, zoom, canvas, canvasCtx: ctx } = this.boardStoreState;
    if (!canvas || !ctx) return;
    const x = (this.pos.x - offset.x) * zoom;
    const y = (this.pos.y - offset.y) * zoom;

    if (
      !(
        x + this.width * zoom + zoom / 2 >= 0 &&
        x - zoom * 1.5 <= canvas.width &&
        y + this.height * zoom + zoom / 2 >= 0 &&
        y - zoom * 1.5 <= canvas.height
      )
    )
      return;

    // Draw the frame of the component
    ctx.fillStyle = "#111";
    ctx.strokeStyle = "#111";
    ctx.lineWidth = (zoom / 12) | 0;
    ctx.beginPath();
    ctx.rect(x - zoom / 2, y - zoom / 2, this.width * zoom, this.height * zoom);
    ctx.fill();
    ctx.stroke();

    let color: RGBColor;
    if (this.value === 1) {
      color = {
        r: Math.min(this.color.r * 2, 255),
        g: Math.min(this.color.g * 2, 255),
        b: Math.min(this.color.b * 2, 255),
      };
      if (zoom > 20) ctx.shadowBlur = zoom / 3;
      ctx.shadowColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    } else {
      color = {
        r: Math.min(this.color.r / 2, 255),
        g: Math.min(this.color.g / 2, 255),
        b: Math.min(this.color.b / 2, 255),
      };
    }
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.beginPath();
    ctx.arc(
      x - zoom / 2 + (this.width / 2) * zoom,
      y - zoom / 2 + (this.height / 2) * zoom,
      zoom / 4,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw input pins
    this.drawPins(this.inputPins, ctx, zoom, x, y);
    // Draw output pins
    this.drawPins(this.outputPins, ctx, zoom, x, y);
  }
}
