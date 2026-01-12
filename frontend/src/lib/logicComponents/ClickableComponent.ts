export type ComponentClickEventType = "mousedown" | "mouseup";

export default interface ClickableComponent {
  handleClick(eventType: ComponentClickEventType): void;
}
