<script lang="ts">
    import ToolbarItem from "$/views/workspace/toolbar/ToolbarItem.svelte";
    type ToolbarItem = {
        text?: string;
        icon?: string;
        tip: string;
        tipSubtext?: string;
    };

    const toolbarItems: ToolbarItem[] = [
        {
            text: "I/O",
            tip: "Input and output ports",
        },
        {
            text: "!",
            tip: "NOT gate",
            tipSubtext: "Right click for details",
        },
        {
            text: "&",
            tip: "AND gate",
            tipSubtext: "Right click for details",
        },
        {
            text: "|",
            tip: "OR gate",
            tipSubtext: "Right click for details",
        },
        {
            text: "^",
            tip: "XOR gate",
            tipSubtext: "Right click for details",
        },
        {
            icon: "memory",
            tip: "Custom component",
        },
        {
            icon: "list",
            tip: "Saved components",
        },
    ];
</script>

<div class="container">
    <span class="toast">Selected And gate for me</span>
    <ul class="toolbar-items">
        {#each toolbarItems as item, id (id)}
            <ToolbarItem {...item} />
        {/each}
    </ul>
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
