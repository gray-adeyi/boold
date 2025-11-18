<script lang="ts">
    import AppVersionButton from "$/views/board/floatingMenu/AppVersionButton.svelte";
    import FloatingMenuDropdown from "$/views/board/floatingMenu/FloatingMenuDropdown.svelte";
    import FloatingMenuDropdownButton from "$/views/board/floatingMenu/FloatingMenuDropdownButton.svelte";
    import PauseSimulationButton from "$/views/board/floatingMenu/PauseSimulationButton.svelte";

    let isDropdownVisible = $state(false);

    const toggleDropdownVisibility = () => {
        isDropdownVisible = !isDropdownVisible;
    };
</script>

<div class="container">
    <FloatingMenuDropdownButton
        {isDropdownVisible}
        onclick={toggleDropdownVisibility}
    />
    {#if isDropdownVisible}
        <FloatingMenuDropdown />
    {/if}
    <PauseSimulationButton />
    <AppVersionButton />
</div>

<style>
    .container {
        --offset: 5px;
        display: flex;
        gap: 6px;
        position: absolute;
        right: var(--offset);
        bottom: var(--offset);
    }
</style>
