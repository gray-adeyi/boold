import type { BoardStoreState } from "$/stores/boardStore.svelte";
import type {
	ComponentInputPin,
	ComponentOutputPin,
	Coord,
	RGBColor,
} from "$/types";

const updateQueue = [];

export default class Wire {
	readonly id = crypto.randomUUID();
	path: Coord[];
	intersections: { pos: Coord; type: number }[];
	from: ComponentOutputPin;
	to: ComponentInputPin;
	value: number;
	inputConnections: Wire[];
	outputConnections: Wire[];
	color: RGBColor;
	boardStoreState: BoardStoreState;

	constructor(
		path: Coord[] = [],
		intersections = [],
		color: RGBColor = { r: 136, g: 136, b: 136 },
		from: ComponentOutputPin,
		to: ComponentInputPin,
		boardStoreState: BoardStoreState,
	) {
		this.path = path;
		this.intersections = intersections;
		this.boardStoreState = boardStoreState;

		this.from = from;
		this.to = to;
		this.value = 0;

		this.inputConnections = [];
		this.outputConnections = [];
		this.color = color;
	}

	updateValue(value: number = 0, from?: Wire): number {
		if (value === 1 || (this.from && this.from.value === 1)) {
			value = 1;
		}
		const firstMatchWithValueOfOne = this.inputConnections.find(
			(wire) => wire !== from && wire.value === 1,
		);
		if (firstMatchWithValueOfOne) {
			const inputConnectionsValues = this.inputConnections.map(
				(wire) => wire.value,
			);
			this.inputConnections.forEach((connection, index) => {
				if (connection.inputConnections.includes(this))
					inputConnectionsValues[index] = connection.updateValue(value, this);
			});

			if (inputConnectionsValues.indexOf(1) > -1) {
				value = 1;
			} else {
				value = 0;
			}
		} else {
			value = 0;
		}
		return value;
	}

	update(value: number, from?: Wire) {
		if (this.inputConnections.length > 0) {
			value = this.updateValue(value, from);
		}
		if (this.value === value) return;
		this.value = value;

		this.outputConnections.forEach((connection) => {
			if (connection !== from)
				updateQueue.push(connection.update.bind(connection, this.value, this));
		});

		if (this.to && this.to.value !== this.value) {
			this.to.value = this.value;
			updateQueue.push(this.to.component.update.bind(this.to.component));
		}
	}

	draw() {
		const ctx = this.boardStoreState.canvasCtx;
		if (!ctx) return;
		if (this.boardStoreState.zoom > 50) {
			ctx.lineCap = "round";
		}
		let color: RGBColor;
		if (this.value === 1) {
			color = this.color;
		} else {
			const newColorValue = (oldValue: number) =>
				((oldValue + 255 + 255 + 255) / 4) | 0;
			const r = newColorValue(this.color.r);
			const g = newColorValue(this.color.g);
			const b = newColorValue(this.color.b);
			color = { r, g, b };
		}
		ctx.strokeStyle = `rgb(${color.r} ${color.g} ${color.b})`;

		const path: Coord[] = [];
		for (let i = 0; i < this.path.length; i++) {
			const isFirstOrLastCoord = i === 0 || i === this.path.length - 1;
			const xDistanceFromCurrentCoordToPrevious =
				this.path[i].x - this.path[i - 1].x;
			const xDistanceFromNextCoordToCurrent =
				this.path[i + 1].x - this.path[i].x;
			const yDistanceFromCurrentCoordToPrevious =
				this.path[i].y - this.path[i - 1].y;
			const yDistanceFromNextCoordToCurrent =
				this.path[i + 1].y - this.path[i].y;
			if (isFirstOrLastCoord) {
				path.push(Object.assign({}, this.path[i]));
			} else if (
				xDistanceFromCurrentCoordToPrevious !==
					xDistanceFromNextCoordToCurrent ||
				!(
					yDistanceFromCurrentCoordToPrevious !==
					yDistanceFromNextCoordToCurrent
				)
			) {
				path.push(Object.assign({}, this.path[i]));
			}
		}

		ctx.beginPath();
		path.forEach((coord) => {
			ctx.lineTo(
				((coord.x - this.boardStoreState.offset.x) *
					this.boardStoreState.zoom) |
					0,
				(-(coord.y - this.boardStoreState.offset.y) *
					this.boardStoreState.zoom) |
					0,
			);
		});
		ctx.stroke();

		this.intersections.forEach((intersection) => {
			if (!intersection.type) ctx.fillStyle = "#111";
			else if (intersection.type === 1) ctx.fillStyle = "#11f";
			else if (intersection.type === 2) ctx.fillStyle = "#1f1";
			else if (intersection.type === 3) ctx.fillStyle = "#f11";
			ctx.beginPath();
			ctx.arc(
				(intersection.x - this.boardStoreState.offset.x) *
					this.boardStoreState.zoom,
				-(intersection.y - this.boardStoreState.offset.y) *
					this.boardStoreState.zoom,
				this.boardStoreState.zoom / 8,
				0,
				Math.PI * 2,
			);
			ctx.fill();
		});
	}
}
