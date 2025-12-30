<script lang="ts">
import { Portal } from "@jsrob/svelte-portal";
import ANDGateComponent from "$/lib/logicComponents/ANDGateComponent.svelte";
import ButtonComponent from "$/lib/logicComponents/ButtonComponent.svelte";
import BuzzerComponent from "$/lib/logicComponents/BuzzerComponent.svelte";
import ClockComponent from "$/lib/logicComponents/ClockComponent.svelte";
import ConstantComponent from "$/lib/logicComponents/ConstantComponent.svelte";
import CounterComponent from "$/lib/logicComponents/CounterComponent.svelte";
import { selectComponent as doSelectComponent } from "$/lib/logicComponents/componentManipulation.svelte";
import DebugComponent from "$/lib/logicComponents/DebugComponent.svelte";
import DelayComponent from "$/lib/logicComponents/DelayComponent.svelte";
import DisplayComponent from "$/lib/logicComponents/DisplayComponent.svelte";
import InputComponent from "$/lib/logicComponents/InputComponent.svelte";
import LEDComponent from "$/lib/logicComponents/LEDComponent.svelte";
import NOTGateComponent from "$/lib/logicComponents/NOTGateComponent.svelte";
import ORGateComponent from "$/lib/logicComponents/ORGateComponent.svelte";
import OutputComponent from "$/lib/logicComponents/OutputComponent.svelte";
import ROMComponent from "$/lib/logicComponents/ROMComponent.svelte";
import TimerEndComponent from "$/lib/logicComponents/TimerEndComponent.svelte";
import TimerStartComponent from "$/lib/logicComponents/TimerStartComponent.svelte";
import XORGateComponent from "$/lib/logicComponents/XORGateComponent.svelte";
import { state as boardStoreState } from "$/stores/boardStore.svelte";
import type { AnyLogicComponentClass } from "$/types";
import ANDGateInfoDialog from "$/views/board/components/toolbar/dialogs/ANDGateInfoDialog.svelte";
import NOTGateInfoDialog from "$/views/board/components/toolbar/dialogs/NOTGateInfoDialog.svelte";
import ORGateInfoDialog from "$/views/board/components/toolbar/dialogs/ORGateInfoDialog.svelte";
import XORGateInfoDialog from "$/views/board/components/toolbar/dialogs/XORGateInfoDialog.svelte";
import IOSelectDropdown from "$/views/board/components/toolbar/IOSelectDropdown.svelte";
import ToolbarItem from "$/views/board/components/toolbar/ToolbarItem.svelte";

type ToolbarItem = {
	text?: string;
	icon?: string;
	tip: string;
	tipSubtext?: string;
	onclick: () => void;
	onrightclick?: () => void;
};

let isIOSelectDropdownVisible = $state(false);
let isNOTGateDialogVisible = $state(false);
let isANDGateDialogVisible = $state(false);
let isORGateDialogVisible = $state(false);
let isXORGateDialogVisible = $state(false);

const toastTimeout = 800;
let isToastVisible = $state(false);
let toastTimeoutId: NodeJS.Timeout | null = $state(null);
let toastMessage: string | null = $state(null);

const showToast = (message: string) => {
	if (toastTimeoutId) clearTimeout(toastTimeoutId);
	toastMessage = message;
	isToastVisible = true;
	toastTimeoutId = setTimeout(() => {
		(toastMessage = null), (isToastVisible = false);
	}, toastTimeout);
};

const toggleIOSelectDropdownVisibility = () => {
	isIOSelectDropdownVisible = !isIOSelectDropdownVisible;
};

const selectComponent = (
	component: AnyLogicComponentClass,
	componentName: string,
) => {
	if (boardStoreState.componentInSelectionFocus === component) {
		showToast(`${componentName} is already selected`);
		return;
	}
	doSelectComponent(component, boardStoreState);
	showToast(`${componentName} is selected`);
};

const selectComponentInDropdown = (
	component: AnyLogicComponentClass,
	componentName: string,
) => {
	selectComponent(component, componentName);
	isIOSelectDropdownVisible = false;
};

const ioSelectClickHandlers: Record<string, () => void> = {
	[InputComponent as any]: () =>
		selectComponentInDropdown(InputComponent, "Input"),
	[OutputComponent as any]: () =>
		selectComponentInDropdown(OutputComponent, "Output"),
	[ButtonComponent as any]: () =>
		selectComponentInDropdown(ButtonComponent, "Button"),
	[ConstantComponent as any]: () =>
		selectComponentInDropdown(ConstantComponent, "Constant"),
	[DelayComponent as any]: () =>
		selectComponentInDropdown(DelayComponent, "Delay"),
	[ClockComponent as any]: () =>
		selectComponentInDropdown(ClockComponent, "Clock"),
	[LEDComponent as any]: () => selectComponentInDropdown(LEDComponent, "LED"),
	[DisplayComponent as any]: () =>
		selectComponentInDropdown(DisplayComponent, "Display"),
	[DebugComponent as any]: () =>
		selectComponentInDropdown(DebugComponent, "Debug"),
	[BuzzerComponent as any]: () =>
		selectComponentInDropdown(BuzzerComponent, "Buzzer"),
	[CounterComponent as any]: () =>
		selectComponentInDropdown(CounterComponent, "Counter"),
	[TimerStartComponent as any]: () =>
		selectComponentInDropdown(TimerStartComponent, "Timer start"),
	[TimerEndComponent as any]: () =>
		selectComponentInDropdown(TimerEndComponent, "Timer end"),
	[ROMComponent as any]: () => selectComponentInDropdown(ROMComponent, "ROM"),
};

const toolbarItems: ToolbarItem[] = [
	{
		text: "I/O",
		tip: "Input and output ports",
		onclick: toggleIOSelectDropdownVisibility,
	},
	{
		text: "!",
		tip: "NOT gate",
		tipSubtext: "Right click for details",
		onclick: () => {
			selectComponent(NOTGateComponent, "NOT gate");
		},
		onrightclick: () => (isNOTGateDialogVisible = true),
	},
	{
		text: "&",
		tip: "AND gate",
		tipSubtext: "Right click for details",
		onclick: () => {
			selectComponent(ANDGateComponent, "AND gate");
		},
		onrightclick: () => (isANDGateDialogVisible = true),
	},
	{
		text: "|",
		tip: "OR gate",
		tipSubtext: "Right click for details",
		onclick: () => {
			selectComponent(ORGateComponent, "OR gate");
		},
		onrightclick: () => (isORGateDialogVisible = true),
	},
	{
		text: "^",
		tip: "XOR gate",
		tipSubtext: "Right click for details",
		onclick: () => {
			selectComponent(XORGateComponent, "XOR gate");
		},
		onrightclick: () => (isXORGateDialogVisible = true),
	},
	{
		icon: "memory",
		tip: "Custom component",
		onclick: () => {},
	},
	{
		icon: "list",
		tip: "Saved components",
		onclick: () => {},
	},
];
</script>

<div class="container">
    {#if isToastVisible}
        <span class="toast">{toastMessage}</span>
    {/if}
    {#if isIOSelectDropdownVisible}
        <IOSelectDropdown {ioSelectClickHandlers} />
    {/if}
    <ul class="toolbar-items">
        {#each toolbarItems as item, id (id)}
            <ToolbarItem {...item} />
        {/each}
    </ul>
    <Portal target="#workspace-portal-target">
        {#if isNOTGateDialogVisible}
            <NOTGateInfoDialog
                onclose={() => (isNOTGateDialogVisible = false)}
            />
        {/if}
        {#if isANDGateDialogVisible}
            <ANDGateInfoDialog
                onclose={() => (isANDGateDialogVisible = false)}
            />
        {/if}
        {#if isORGateDialogVisible}
            <ORGateInfoDialog onclose={() => (isORGateDialogVisible = false)} />
        {/if}
        {#if isXORGateDialogVisible}
            <XORGateInfoDialog
                onclose={() => (isXORGateDialogVisible = false)}
            />
        {/if}
    </Portal>
</div>

<style>
    .container {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }

    .toast {
        display: block;
        position: absolute;
        color: var(--color-app-black);
        background: var(--color-app-white);
        font-size: 0.9375rem;
        border-radius: 50px;
        padding: 10px 25px;
        top: -50px;
        left: 50%;
        white-space: nowrap;
        transform: translateX(-50%);
    }

    .toolbar-items {
        display: flex;
        align-items: center;
        list-style-type: none;
        border-radius: 5px 5px 0 0;
        box-shadow: 0 0 20px rgba(0 0 0 / 0.5);
    }
</style>
