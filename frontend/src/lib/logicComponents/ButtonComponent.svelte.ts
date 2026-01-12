import PrimitiveComponent from "$/lib/logicComponents/PrimitiveComponent.svelte";
import type { BoardStoreState } from "$/stores/boardStore.svelte";
import type { Coord } from "$/types";
import type ClickableComponent from "$/lib/logicComponents/ClickableComponent";
import type { ComponentClickEventType } from "$/lib/logicComponents/ClickableComponent";

export default class ButtonComponent extends PrimitiveComponent implements ClickableComponent {
  constructor(name: string | null, pos: Coord, boardStoreState: BoardStoreState) {
    super(name, pos, 2, 1, { type: "icon", text: "radio_button_checked" }, boardStoreState);
    this.addOutputPin({ side: 1, sideIndex: 0 }, "OUT");
    this.value = 0;
  }

  handleClick(eventType: ComponentClickEventType): void {
    this.value = eventType === "mouseup" ? 0 : 1;
    this.update();
  }

  execute(): void {
    if (this.value === null) return;
    this.outputPins[0].value = this.value;
  }
}
