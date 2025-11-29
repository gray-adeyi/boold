<script lang="ts">
import { toggleTutorialDrawer } from "$/stores/boardStore.svelte";
import type { FloatingMenuOption } from "$/types";
import AppVersionButton from "$/views/board/floatingMenu/AppVersionButton.svelte";
import FloatingMenuDropdown from "$/views/board/floatingMenu/FloatingMenuDropdown.svelte";
import FloatingMenuDropdownButton from "$/views/board/floatingMenu/FloatingMenuDropdownButton.svelte";
import PauseSimulationButton from "$/views/board/floatingMenu/PauseSimulationButton.svelte";

let isDropdownVisible = $state(false);

const toggleDropdownVisibility = () => {
	isDropdownVisible = !isDropdownVisible;
};

const menuOptions: FloatingMenuOption[] = [
	{
		icon: "add",
		display: "New board",
		shortcut: "Ctrl+N",
		action: () => {},
	},
	{
		icon: "folder",
		display: "Open board",
		shortcut: "Ctrl+O",
		action: () => {},
	},
	{
		icon: "save",
		display: "Save board",
		shortcut: "Ctrl+S",
		action: () => {},
	},
	{
		icon: "featured_play_list",
		display: "Open console",
		shortcut: "Shift+T",
		action: () => {},
	},
	{
		icon: "settings",
		display: "Settings",
		shortcut: "Ctrl+Shift+S",
		action: () => {},
	},
	{
		icon: "help",
		display: "Open tutorial",
		shortcut: "F1",
		action: () => {
			console.log("i executed!");
			toggleTutorialDrawer();
			isDropdownVisible = false;
		},
	},
	{
		icon: "exit_to_app",
		display: "Quit",
		action: () => {},
	},
];
</script>

<div class="container">
    <FloatingMenuDropdownButton
        {isDropdownVisible}
        onclick={toggleDropdownVisibility}
    />
    {#if isDropdownVisible}
        <FloatingMenuDropdown {menuOptions} />
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
