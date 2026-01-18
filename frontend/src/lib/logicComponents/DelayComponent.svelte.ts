import type { Coord } from "$/types";
import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";

export default class DelayComponent extends PrimitiveComponent {
  lastUpdate: Date = new Date();
  constructor(name: string | null, pos: Coord, boardStoreState: BoardStoreState) {
    super(name, pos, 2, 1, { type: "icon", text: "timer" }, boardStoreState);
    this.addInputPin({ side: 3, sideIndex: 0 }, "IN");
    this.addOutputPin({ side: 1, sideIndex: 0 }, "OUT");
  }

  update() {
    if (this.boardStoreState.settings.isShowComponentUpdatesEnabled) this.highlight(250);
    this.lastUpdate = new Date();
    const { value } = this.inputPins[0];
    setTimeout(
      () =>
        this.boardStoreState.updateQueue.push(() => {
          this.outputPins[0].value = value;
          if (this.outputPins[0].connection) this.outputPins[0].connection?.update(value);
        }),
      this.properties.delay,
    );
  }

  draw() {
    const { offset, zoom, canvasCtx, canvas } = this.boardStoreState;
    const ctx = canvasCtx;
    if (!canvas || !ctx) return;
    const x = (this.pos.x - offset.x) * zoom;
    const y = -(this.pos.y - offset.y) * zoom;

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
    if (this.outline) {
      ctx.strokeStyle = "#f00";
    } else {
      ctx.strokeStyle = "#000";
    }
    ctx.fillStyle = "#fff";
    ctx.lineWidth = (zoom / 12) | 0;
    ctx.beginPath();
    ctx.rect(x - zoom / 2, y - zoom / 2, this.width * zoom, this.height * zoom);
    if (zoom > 24) ctx.fill();
    ctx.stroke();

    const dTime = new Date().getTime() - this.lastUpdate.getTime();
    if (this.outputPins[0].value === 0 && dTime > 0 && dTime < (this.properties?.delay || 0)) {
      const ratio = Math.min(dTime / (this.properties.delay || 0), 1);
      ctx.fillStyle = "#ddd";
      ctx.fillRect(
        x - zoom / 2 + zoom / 24,
        y - zoom / 2 + zoom / 24,
        Math.max(this.width * zoom * ratio - zoom / 12, 0),
        this.height * zoom - zoom / 12,
      );
    }
    ctx.textBaseline = "middle";

    // Draw the icon of the component
    if (this.icon && zoom > 3) {
      ctx.textAlign = "center";

      if (this.icon.type === "icon") {
        ctx.fillStyle = this.value ? "#aaa" : "#111";
        ctx.font = `${zoom / 1.3}px Material Icons`;
        ctx.fillText(
          this.icon.text,
          x + ((this.width - 1) / 2) * zoom,
          y + ((this.height - 1) / 2) * zoom,
        );
      } else if (this.icon.type === "value") {
        ctx.fillStyle = "#111";
        ctx.font = `normal normal normal ${zoom / 1.3}px Monospaced`;
        ctx.fillText(
          this.value?.toString() || "",
          x + ((this.width - 1) / 2) * zoom,
          y + ((this.height - 0.85) / 2) * zoom,
        );
      }
    }

    // Draw the name of the component in the upper left corner
    if (this.name && zoom > 30) {
      ctx.textAlign = "left";
      ctx.font = `italic normal normal ${zoom / 7}px Ubuntu`;
      ctx.fillStyle = "#888";
      ctx.fillText(this.name, x - 0.5 * zoom + zoom / 15, y - 0.37 * zoom);
    }

    // Draw the delay value of the component in the bottom left corner
    if (this.properties.delay && zoom > 30) {
      ctx.textAlign = "left";
      ctx.font = `italic normal normal ${zoom / 7}px Ubuntu`;
      ctx.fillStyle = "#888";
      ctx.fillText(
        `${this.properties.delay} ms`,
        x - 0.5 * zoom + zoom / 15,
        y + this.height * zoom - 0.63 * zoom,
      );
    }

    // Draw input pins
    this.drawPins(this.inputPins, ctx, zoom, x, y);
    // Draw output pins
    this.drawPins(this.outputPins, ctx, zoom, x, y);
  }
}
