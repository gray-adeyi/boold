import type { ComponentPin, Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";

type SegmentPath = {
  a: Coord;
  b: Coord;
  c: Coord;
  d: Coord;
  e: Coord;
};

export default class DisplayComponent extends PrimitiveComponent {
  outline: number = 0;
  fillColor: string = "#111";
  strokeColor: string = "#111";
  private lineWidth: number;
  private colorOff: string;
  private colorOn: string;
  constructor(name: string | null, pos: Coord, boardStoreState: BoardStoreState, color = "#a00") {
    super(name, pos, 4, 5, { type: "value" }, boardStoreState);
    this.addInputPin({ side: 0, sideIndex: 0 }, "A");
    this.addInputPin({ side: 0, sideIndex: 1 }, "B");
    this.addInputPin({ side: 0, sideIndex: 2 }, "C");
    this.addInputPin({ side: 0, sideIndex: 3 }, "D");
    this.addInputPin({ side: 2, sideIndex: 0 }, "E");
    this.addInputPin({ side: 2, sideIndex: 1 }, "F");
    this.addInputPin({ side: 2, sideIndex: 2 }, "G");
    this.addInputPin({ side: 2, sideIndex: 3 }, "DP");
    this.value = 0;

    this.lineWidth = 0.12;
    this.hOffset = this.width / 8;
    this.colorOff = "#300";
    this.colorOn = "#f00";
  }

  update() {}

  draw() {
    const { zoom, offset, canvasCtx: ctx, canvas } = this.boardStoreState;
    if (!ctx || !canvas) return;
    let x = (this.pos.x - offset.x) * zoom;
    let y = (this.pos.y - offset.y) * zoom;

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
    ctx.fillStyle = this.fillColor || "#111";
    ctx.strokeStyle = this.strokeColor || "#111";
    ctx.lineWidth = (zoom / 12) | 0;
    ctx.beginPath();
    ctx.rect(x - zoom / 2, y - zoom / 2, this.width * zoom, this.height * zoom);
    ctx.fill();
    ctx.stroke();

    // Draw display segements
    x = x - zoom / 2;
    y = y - zoom / 2;
    const hOffset = (this.width / 8) * zoom;
    const vOffset = (this.width / 8 / 2 / (this.width - 1)) * this.height * zoom;
    const lineWidth = this.lineWidth * this.height * zoom;
    const margin = zoom / 20;
    ctx.shadowColor = this.colorOn;

    // Segment A, top mid
    let sx = x + hOffset + lineWidth + margin;
    let sy = y + vOffset;
    let sLength = (this.width - 1) * zoom - 2 * lineWidth - hOffset - margin * 2;
    let p: SegmentPath = this.getHorizontalSegmentPath(sx, sy, sLength, lineWidth);
    let start = { x: sx, y: sy };
    this.drawSegment(ctx, this.inputPins[0], zoom, start, p);

    // Segment G, mid mid
    sy = y + ((this.height / 2) * zoom - lineWidth / 2);
    start.y = sy;
    p = this.getHorizontalSegmentPath(sx, sy, sLength, lineWidth);
    this.drawSegment(ctx, this.inputPins[6], zoom, start, p);

    // Segment D, bottom mid
    sy = y + (this.height * zoom - vOffset - lineWidth);
    start.y = sy;
    p = this.getHorizontalSegmentPath(sx, sy, sLength, lineWidth);
    this.drawSegment(ctx, this.inputPins[3], zoom, start, p);

    // Segment F, top left
    sx = x + hOffset;
    sy = y + vOffset + lineWidth + margin;
    sLength = (this.height / 2) * zoom - lineWidth * 1.5 - vOffset - margin * 2;
    start = { x: sx, y: sy };
    p = this.getVerticalSegmentPath(sx, sy, sLength, lineWidth);
    this.drawSegment(ctx, this.inputPins[5], zoom, start, p);

    // Segment B, bottom left
    sx = x + (this.width - 1) * zoom - lineWidth;
    start.x = sx;
    p = this.getVerticalSegmentPath(sx, sy, sLength, lineWidth);
    this.drawSegment(ctx, this.inputPins[1], zoom, start, p);

    // Segment E, top right
    sx = x + hOffset;
    sy = y + (this.height / 2) * zoom + lineWidth / 2 + margin;
    start = { x: sx, y: sy };
    p = this.getVerticalSegmentPath(sx, sy, sLength, lineWidth);
    this.drawSegment(ctx, this.inputPins[4], zoom, start, p);

    // Segment C, bottom right
    sx = x + (this.width - 1) * zoom - lineWidth;
    start.x = sx;
    p = this.getVerticalSegmentPath(sx, sy, sLength, lineWidth);
    this.drawSegment(ctx, this.inputPins[2], zoom, start, p);

    // Decimal Point segment
    ctx.fillStyle = this.inputPins[7].value ? this.colorOn : this.colorOff;
    if (zoom > 20) ctx.shadowBlur = this.inputPins[7].value ? zoom / 2 : 0;
    ctx.beginPath();
    ctx.arc(
      x + (this.width - 0.5) * zoom,
      y + (this.height - 0.5) * zoom,
      zoom / 4,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    ctx.shadowBlur = 0;

    x = x + zoom / 2;
    y = y + zoom / 2;

    // Draw input pins
    this.drawPins(this.inputPins, ctx, zoom, x, y);
    // Draw output pins
    this.drawPins(this.outputPins, ctx, zoom, x, y);

    // If the component is highlighted, draw a colored layer over the frame
    if (this.outline > 0) {
      ctx.strokeStyle = "#d00";
      ctx.lineWidth = (zoom / 12) | 0;
      ctx.beginPath();
      ctx.rect(x - zoom / 2, y - zoom / 2, this.width * zoom, this.height * zoom);
      ctx.stroke();
    }
  }

  private drawSegment(
    ctx: CanvasRenderingContext2D,
    pin: ComponentPin,
    zoom: number,
    start: Coord,
    p: SegmentPath,
  ) {
    ctx.fillStyle = pin.value ? this.colorOn : this.colorOff;
    if (zoom > 20) ctx.shadowBlur = pin.value ? zoom / 2 : 0;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(p.a.x, p.a.y);
    ctx.lineTo(p.b.x, p.b.y);
    ctx.lineTo(p.c.x, p.c.y);
    ctx.lineTo(p.d.x, p.d.y);
    ctx.lineTo(p.e.x, p.e.y);
    ctx.fill();
  }

  private getHorizontalSegmentPath(
    sx: number,
    sy: number,
    sLength: number,
    lineWidth: number,
  ): SegmentPath {
    return {
      a: { x: sx + sLength, y: sy },
      b: { x: sx + sLength + lineWidth / 2, y: sy + lineWidth / 2 },
      c: { x: sx + sLength, y: sy + lineWidth },
      d: { x: sx, y: sy + lineWidth },
      e: { x: sx - lineWidth / 2, y: sy + lineWidth / 2 },
    };
  }

  private getVerticalSegmentPath(
    sx: number,
    sy: number,
    sLength: number,
    lineWidth: number,
  ): SegmentPath {
    return {
      a: { x: sx + lineWidth / 2, y: sy - lineWidth / 2 },
      b: { x: sx + lineWidth, y: sy },
      c: { x: sx + lineWidth, y: sy + sLength },
      d: { x: sx + lineWidth / 2, y: sy + sLength + lineWidth / 2 },
      e: { x: sx, y: sy + sLength },
    };
  }
}
