<script lang="ts">
    import AppVersionButton from "$/views/workspace/floatingMenu/AppVersionButton.svelte";
    import FloatingMenuDropdown from "$/views/workspace/floatingMenu/FloatingMenuDropdown.svelte";
    import FloatingMenuDropdownButton from "$/views/workspace/floatingMenu/FloatingMenuDropdownButton.svelte";
    import PauseSimulationButton from "$/views/workspace/floatingMenu/PauseSimulationButton.svelte";
    
</script>


<div class="container">
    <FloatingMenuDropdownButton />
    <FloatingMenuDropdown />
    <PauseSimulationButton />
    <AppVersionButton />   
</div>

<style>
    .container{
        display: flex;
        gap: 6px;
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
</style>