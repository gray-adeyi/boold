<script lang="ts">
import type { Snippet } from "svelte";
import { fade } from "svelte/transition";
import { setOpenedMenuHeight } from "$/stores/startMenuStore.svelte";

type Props = {
	readonly title?: string;
	readonly isVisible?: boolean;
	readonly children?: Snippet;
};
const props: Props = $props();

function updateOpenedOptionHeight(node: HTMLDivElement) {
	setOpenedMenuHeight(node.clientHeight);
	return () => setOpenedMenuHeight(0);
}
</script>

{#if props.isVisible}
<div class="body" transition:fade {@attach updateOpenedOptionHeight}>
    {#if props.title}<h2 class="title">{props.title}</h2>{/if}
    {@render props.children?.()}
</div>
{/if}

<style>
    .body {
        display: flex;
        flex-direction: column;
        place-items: center;
        width: 100%;
        position: absolute;
        overflow: visible;
        z-index: 1;
        background-color: var(--color-app-white);
        padding-block-end: 50px;

        &::before{
            --size: 30px;
            content: "";
            position: absolute;
            width: var(--size);
            height: var(--size);
            top: calc(-0.5 * var(--size));
            left: calc(50% + 30px);
            transform: translateX(-50%) rotate(45deg);
            z-index: 1;
            background-color: var(--color-app-white);
        }
    }

    .title{
        font-family: var(--font-ubuntu);
        font-size: 2rem;
        font-weight: normal;
        margin-block: 1.875rem;
    }
</style>