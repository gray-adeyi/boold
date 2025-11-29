<script lang="ts">
import BuzzerComponent from "$/lib/logicComponents/BuzzerComponent.svelte";
import ButtonComponent from "$/lib/logicComponents/ButtonComponent.svelte";
import ClockComponent from "$/lib/logicComponents/ClockComponent.svelte";
import ConstantComponent from "$/lib/logicComponents/ConstantComponent.svelte";
import CounterComponent from "$/lib/logicComponents/CounterComponent.svelte";
import DebugComponent from "$/lib/logicComponents/DebugComponent.svelte";
import DelayComponent from "$/lib/logicComponents/DelayComponent.svelte";
import DisplayComponent from "$/lib/logicComponents/DisplayComponent.svelte";
import InputComponent from "$/lib/logicComponents/InputComponent.svelte";
import LEDComponent from "$/lib/logicComponents/LEDComponent.svelte";
import OutputComponent from "$/lib/logicComponents/OutputComponent.svelte";
import ROMComponent from "$/lib/logicComponents/ROMComponent.svelte";
import TimerEndComponent from "$/lib/logicComponents/TimerEndComponent.svelte";
import TimerStartComponent from "$/lib/logicComponents/TimerStartComponent.svelte";

type Props = {
	ioSelectClickHandlers: Record<string, () => void>;
};
type IOSelectOption = {
	displayText: string;
	displayTextTransform: "uppercase" | "capitalize";
	onclick: () => void;
};

const { ioSelectClickHandlers }: Props = $props();
const options: IOSelectOption[] = [
	{
		displayText: "input",
		displayTextTransform: "capitalize",
		onclick: ioSelectClickHandlers[InputComponent as any],
	},
	{
		displayText: "output",
		displayTextTransform: "capitalize",
		onclick: () => ioSelectClickHandlers[OutputComponent as any],
	},
	{
		displayText: "button",
		displayTextTransform: "capitalize",
		onclick: () => ioSelectClickHandlers[ButtonComponent as any],
	},
	{
		displayText: "constant",
		displayTextTransform: "capitalize",
		onclick: () => ioSelectClickHandlers[ConstantComponent as any],
	},
	{
		displayText: "delay",
		displayTextTransform: "capitalize",
		onclick: () => ioSelectClickHandlers[DelayComponent as any],
	},
	{
		displayText: "clock",
		displayTextTransform: "capitalize",
		onclick: () => ioSelectClickHandlers[ClockComponent as any],
	},
	{
		displayText: "led",
		displayTextTransform: "uppercase",
		onclick: () => ioSelectClickHandlers[LEDComponent as any],
	},
	{
		displayText: "display",
		displayTextTransform: "capitalize",
		onclick: () => ioSelectClickHandlers[DisplayComponent as any],
	},
	{
		displayText: "debug",
		displayTextTransform: "capitalize",
		onclick: () => ioSelectClickHandlers[DebugComponent as any],
	},
	{
		displayText: "buzzer",
		displayTextTransform: "capitalize",
		onclick: () => ioSelectClickHandlers[BuzzerComponent as any],
	},
	{
		displayText: "counter",
		displayTextTransform: "capitalize",
		onclick: () => ioSelectClickHandlers[CounterComponent as any],
	},
	{
		displayText: "timer start",
		displayTextTransform: "capitalize",
		onclick: () => ioSelectClickHandlers[TimerStartComponent as any],
	},
	{
		displayText: "timer end",
		displayTextTransform: "capitalize",
		onclick: () => ioSelectClickHandlers[TimerEndComponent as any],
	},
	{
		displayText: "rom",
		displayTextTransform: "uppercase",
		onclick: () => ioSelectClickHandlers[ROMComponent as any],
	},
];
</script>

<ul class="container">
    {#each options as option (option.displayText)}
        <li class="io-option">
            <button
                onclick={option.onclick}
                class={[
                    "select-button",
                    {
                        "select-button--text-upper":
                            option.displayTextTransform === "uppercase",
                    },
                ]}>{option.displayText}</button
            >
        </li>
    {/each}
</ul>

<style>
    .container {
        position: absolute;
        bottom: 50px;
        list-style: none;
        font-size: 0.9375rem;
        background: var(--color-app-black);
        color: var(--color-app-white);
        box-shadow: 0 0 20px rgba(0 0 0 / 0.5);
        border-radius: 5px;
        max-height: 300px;
        overflow-y: auto;
        width: 150px;

        &::-webkit-scrollbar-track {
            background: rgba(225 225 225 / 0.1);
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(255 255 255 / 0.3);
            border-radius: 5px;
        }
    }

    .select-button {
        display: block;
        width: 100%;
        padding: 10px;
        cursor: pointer;
        background: none;
        border: none;
        border-radius: 5px;
        color: var(--color-app-white);
        text-align: start;
        text-transform: capitalize;

        &:hover {
            background-color: #222;
        }
    }
    .select-button--text-upper {
        text-transform: uppercase;
    }
</style>
