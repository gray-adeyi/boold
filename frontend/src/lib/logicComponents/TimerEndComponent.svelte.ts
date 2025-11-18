import type { Coord } from "$/types";
import PrimitiveComponent from "./PrimitiveComponent.svelte";
// import {state as workspaceStoreState} from "$/stores/workspaceStore.svelte";

export default class TimerEndComponent extends PrimitiveComponent{
  constructor(name: string | null, pos: Coord){
   super(name,pos,2,1,{type: "value"})
  this.addInputPin({side: 3, pinIndex: 0}, "IN")
  this.value = 0 
  }
  
  update(){
    console.timeEnd()
    // booldConsole.log(`${this.name}: ${new Date - workspaceStoreState.timerStart} ms`)
    this.execute()
  }
  
  execute(){
    this.value = this.inputPins[0].value
  }
}