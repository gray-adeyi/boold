<script lang="ts">
    import type {Snippet} from "svelte";

    type Props = {
        readonly title: string;
        readonly isVisible?: boolean;
        readonly children?: Snippet;
    }
    const props = $props();
</script>

{#if props.isVisible}
<div class="dialog">
    <h2>{props.dialogTitle}</h2>
    {@render props.children?.()}
</div>
{/if}

<style>
    .dialog {
        background-color: var(--color-app-white);
    }
</style>