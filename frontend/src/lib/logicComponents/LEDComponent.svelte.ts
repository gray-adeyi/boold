import type { Coord, RGBColor } from "$/types";
import PrimitiveComponent from "./PrimitiveComponent.svelte";


export default class LEDComponent extends PrimitiveComponent {
  private color: RGBColor
  constructor(name: string | null, pos: Coord, color: RGBColor = {r: 100, g: 0, b: 0}){
    super(name, pos, 1,1,{type: "value"})
    this.addInputPin({side: 3, pinIndex: 0}, "IN")
    this.value = 0
    this.color = color
  }
  
  execute(): void {
      this.value = this.inputPins[0].value
  }
}