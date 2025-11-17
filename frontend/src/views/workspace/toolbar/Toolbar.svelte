<script lang="ts">
    import ToolbarItem from "$/views/workspace/toolbar/ToolbarItem.svelte";
    import { Portal } from "@jsrob/svelte-portal";
    import NOTGateInfoDialog from "./dialogs/NOTGateInfoDialog.svelte";
    import IOSelectDropdown from "./IOSelectDropdown.svelte";
    import ANDGateInfoDialog from "./dialogs/ANDGateInfoDialog.svelte";
    import ORGateInfoDialog from "./dialogs/ORGateInfoDialog.svelte";
    import XORGateInfoDialog from "./dialogs/XORGateInfoDialog.svelte";
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

    const toggleIOSelectDropdownVisibility = () => {
        isIOSelectDropdownVisible = !isIOSelectDropdownVisible;
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
            onclick: () => {},
            onrightclick: () => (isNOTGateDialogVisible = true),
        },
        {
            text: "&",
            tip: "AND gate",
            tipSubtext: "Right click for details",
            onclick: () => {},
            onrightclick: () => (isANDGateDialogVisible = true),
        },
        {
            text: "|",
            tip: "OR gate",
            tipSubtext: "Right click for details",
            onclick: () => {},
            onrightclick: () => (isORGateDialogVisible = true),
        },
        {
            text: "^",
            tip: "XOR gate",
            tipSubtext: "Right click for details",
            onclick: () => {},
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
    <span class="toast">Selected And gate for me</span>
    {#if isIOSelectDropdownVisible}
        <IOSelectDropdown />
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
