<script lang="ts">
    import DialogPrimitive from "$/lib/components/DialogPrimitive.svelte";
    type Props = {
        onclose: () => void;
    };
    const { onclose }: Props = $props();
</script>

<DialogPrimitive title="OR gate" {onclose}>
    <h1>|</h1>
</DialogPrimitive>
