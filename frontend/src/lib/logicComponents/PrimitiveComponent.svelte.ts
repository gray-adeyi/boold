import type {
  Coord,
  ComponentIcon,
  ComponentProperties,
  ComponentPort,
  ComponentPortPlacement,
} from "$/types";
import { state as workspaceStoreState } from "$/stores/workspaceStore.svelte";
import type Wire from "./Wire.svelte";

const updateQueue = [];

export default class PrimitiveComponent {
  private id = crypto.randomUUID();
  name: string;
  pos: Coord;
  width: number;
  height: number;
  rotation: number;
  icon: ComponentIcon | null;
  properties: ComponentProperties;
  inputPorts: ComponentPort[];
  outputPorts: ComponentPort[];
  outline?: number;
  value: unknown;

  constructor(
    name: string | null,
    pos: Coord = Object.assign({}, workspaceStoreState.mouse.grid),
    width: number = 2,
    height: number = 2,
    icon: ComponentIcon | null,
  ) {
    if (!name) {
      const similarComponentsCount = workspaceStoreState.components.filter(
        (c) => c.constructor === this.constructor,
      ).length;
      name = `${this.constructor.name}#${similarComponentsCount + 1}`;
    }
    this.name = name;

    this.pos = pos;
    this.width = width;
    this.height = height;
    this.rotation = 0;
    this.icon = icon;
    this.properties = {};
    this.inputPorts = [];
    this.outputPorts = [];
  }

  update() {
    if (workspaceStoreState.settings.isShowComponentUpdatesEnabled)
      this.highlight(250);

    // Update output ports
    // TODO: Figure out what this.function() does
    // this.function()
    const wires: Wire[] = [];
    const values: number[] = [];
    for (let i = 0; i < this.outputPorts.length; i++) {
      const port = this.outputPorts[i];
      if (!port.connection) continue;
      const index = wires.indexOf(port.connection);
      if (index === -1) {
        wires.push(port.connection);
        values.push(port.value);
      } else if (values[index] < port.value) {
        values[index] = port.value;
      }
    }
    for (let i = 0; i < wires.length; i++) {
      updateQueue.push(wires[i].update.bind(wires[i], values[i]));
    }
  }

  highlight(duration: number = 500) {
    this.outline = 1;
    setTimeout(() => {
      this.outline = 0;
    }, duration);
  }

  draw() {
    const { zoom, offset, canvas, canvasCtx } = workspaceStoreState;
    if (!canvas || !canvasCtx) return;
    const ctx = canvasCtx;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const x = (this.pos.x - offset.x) * zoom;
    const y = -(this.pos.y - offset.y) * zoom;

    if (
      !(
        x + this.width * zoom + zoom / 2 >= 0 &&
        x - zoom * 1.5 <= canvasWidth &&
        y + this.height * zoom + zoom / 2 >= 0 &&
        y - zoom * 1.5 <= canvasHeight
      )
    )
      return;
    ctx.strokeStyle = this.outline ? "#f00" : "#111";
    ctx.fillStyle = "#fff";
    ctx.lineWidth = zoom / 12;
    ctx.beginPath();
    ctx.rect(x - zoom / 2, y - zoom / 2, this.width * zoom, this.height * zoom);
    if (zoom > 24) ctx.fill();
    ctx.stroke();
    ctx.textBaseline = "middle";

    // Draw the icon of the component
    if (this.icon && zoom > 3) {
      ctx.textAlign = "center";
      ctx.fillStyle = this.value ? "#aaa" : "#111";
      if (this.icon.type === "icon" || this.icon.type === "char") {
        if (this.icon.type === "icon") {
          ctx.font = `${zoom / 1.3} px Material Icons`;
        } else {
          ctx.font = `normal normal normal ${zoom / 1.2}px Ubuntu`;
        }
        ctx.fillText(
          this.icon.text,
          x + ((this.width - 1) / 2) * zoom,
          y + ((this.height - 1) / 2) * zoom,
        );
      } else if (this.icon.type === "value") {
        ctx.fillStyle = "#111";
        ctx.font = `normal normal normal ${zoom / 1.3}px Ubuntu Mono`;
        ctx.fillText(
          this.value,
          x + ((this.width - 1) / 2) * zoom,
          y + ((this.height - 0.85) / 2) * zoom,
        );
      }
    }

    // Draw the name of the component un the upper left corner
    if (this.name && zoom > 30) {
      ctx.textAlign = "left";
      ctx.font = `italic normal normal ${zoom / 7}px Ubuntu`;
      ctx.fillStyle = "#888";
      ctx.fillText(this.name, x - 0.5 * zoom + zoom / 15, y - 0.37 * zoom);
    }

    // If this component has a delay value, draw the delay value of the component
    // in the bottom left corner
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
    for (let i = 0; i < this.inputPorts.length; i++) {
      const screen = { x, y };
      const placement = this.inputPorts[i].placement;

      const angle = (Math.PI / 2) * placement.side;
      screen.x += Math.sin(angle) * zoom;
      screen.y -= Math.cos(angle) * zoom;
      if (placement.side === 1) {
        screen.x += (this.width - 1) * zoom;
      } else if (placement.side === 2) {
        screen.y += placement.coord * zoom;
      }

      ctx.beginPath();
      ctx.moveTo(
        screen.x - (Math.sin(angle) / 2) * zoom,
        screen.y + (Math.cos(angle) / 2) * zoom,
      );
      ctx.lineTo(screen.x, screen.y);
      ctx.lineWidth = zoom / 8;
      ctx.stroke();

      if (zoom > 10) {
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, zoom / 8 - zoom / 20, 0, Math.PI * 2);
        ctx.lineWidth = zoom / 10;
        ctx.fillStyle = "#fff";
        ctx.stroke();
        ctx.fill();
      }

      if (zoom > 30) {
        const name = this.inputPorts[i].name;
        if (name) {
          ctx.fillStyle = "#888";
          ctx.font = `${zoom}px Ubuntu`;
          ctx.fillText(
            name,
            screen.x - ctx.measureText(name).width / 2,
            placement.side === 2 ? screen.y + zoom / 4 : screen.y - zoom / 4,
          );
        }
      }
    }

    // Draw output pins
    for (let i = 0; i < this.outputPorts.length; i++) {
      const screen = { x, y };
      const placement = this.outputPorts[i].placement;
      const angle = (Math.PI / 2) * placement.side;
      screen.x += Math.sin(angle) * zoom;
      screen.y -= Math.cos(angle) * zoom;
      if (placement.side === 1) {
        screen.x += (this.width - 1) * zoom;
      } else if (placement.side === 2) {
        screen.y += (this.height - 1) * zoom;
      }

      if (placement.side % 2 === 0) {
        screen.x += placement.coord * zoom;
      } else {
        screen.y += placement.coord * zoom;
      }

      ctx.beginPath();
      ctx.moveTo(
        screen.x - (Math.sin(angle) / 2) * zoom,
        screen.y + (Math.cos(angle) / 2) * zoom,
      );
      ctx.lineTo(screen.x, screen.y);
      ctx.lineWidth = zoom / 8;
      ctx.stroke();

      if (zoom > 10) {
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, zoom / 8, 0, Math.PI * 2);
        ctx.fillStyle = "#111";
        ctx.fill();
      }

      if (zoom > 30) {
        const name = this.outputPorts[i].name;
        if (name) {
          ctx.fillStyle = "#888";
          ctx.font = `${zoom / 7}px Ubuntu`;
          ctx.fillText(
            name,
            screen.x - ctx.measureText(name).width / 2,
            placement.side === 2 ? screen.y + zoom / 4 : screen.y - zoom / 4,
          );
        }
      }
    }
  }

  addInputPort(
    placement: ComponentPortPlacement,
    name: string,
    properties: ComponentProperties = {},
  ): ComponentPort {
    let port: ComponentPort = {
      id: crypto.randomUUID(),
      type: "input",
      component: this,
      name,
      placement,
      value: 0,
    };
    port = Object.assign(port, properties);
    this.inputPorts.push(port);
    return port;
  }

  addOutputPort(
    placement: ComponentPortPlacement,
    name: string,
    properties: ComponentProperties = {},
  ): ComponentPort {
    let port: ComponentPort = {
      id: crypto.randomUUID(),
      type: "output",
      component: this,
      name,
      placement,
      value: 0,
    };
    port = Object.assign(port, properties);
    this.outputPorts.push(port);
    return port;
  }

  rotate() {
    // TODO: solution for input/output
    const allPorts = [...this.inputPorts, ...this.outputPorts];
    for (let i = 0; i < allPorts.length; i++) {
      if (allPorts[i].connection) {
        return;
      }
    }
    this.rotation = ++this.rotation % 4;

    const tmp = this.height;
    this.height = this.width;
    this.width = tmp;

    if (this.rotation === 0) {
      this.pos.y -= this.width - this.height;
    }

    if (this.rotation === 2) {
      this.pos.x -= this.width - this.height;
    }

    if (this.rotation === 3) {
      this.pos.y += this.height - this.width;
      this.pos.x += this.height - this.width;
    }

    for (let i = 0; i < this.inputPorts.length; i++) {
      this.inputPorts[i].placement.side =
        ++this.inputPorts[i].placement.side % 4;
    }

    for (let i = 0; i < this.outputPorts.length; i++) {
      this.outputPorts[i].placement.side =
        ++this.outputPorts[i].placement.side % 4;
    }
  }
}
