<script lang="ts">
    import DialogPrimitive from "$/lib/components/DialogPrimitive.svelte";
    type Props = {
        onclose: () => void;
    };
    const { onclose }: Props = $props();
</script>

<DialogPrimitive title="BOOLD v0.0.1" {onclose}>
    <h4>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus amet
        eos quidem officia doloremque quia voluptas veritatis eaque! Adipisci
        aperiam, explicabo rem architecto commodi neque inventore deleniti quae
        illum minus.
    </h4>
</DialogPrimitive>
