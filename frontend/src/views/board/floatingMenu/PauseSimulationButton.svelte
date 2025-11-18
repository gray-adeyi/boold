<script lang="ts">
    import FloatingMenuButton from "$/views/board/floatingMenu/FloatingMenuButton.svelte";

    let isSimulationRunning = $state(true);

    const materialIcon = $derived(isSimulationRunning ? "pause" : "play_arrow");
</script>

<FloatingMenuButton
    {materialIcon}
    onclick={() => {
        isSimulationRunning = !isSimulationRunning;
    }}
/>
