<script lang="ts">
import { navigate } from "$/router";
import { setIsAMenuOptionOpen } from "$/stores/startMenuStore.svelte.js";
import CreateNewBoardOptionBody from "$/views/startMenu/components/optionBodies/CreateNewBoardOptionBody.svelte";
import OpenBoardBody from "$/views/startMenu/components/optionBodies/OpenBoardBody.svelte";
import SettingsOptionBody from "$/views/startMenu/components/optionBodies/SettingsOptionBody.svelte";
import StartMenuOptionsItem from "$/views/startMenu/components/StartMenuOptionsItem.svelte";
import { Quit } from "$runtime";

let isNewBoardBodyOpen = $state(false);
let isOpenBoardBodyOpen = $state(false);
let isSettingsBodyOpen = $state(false);

const toggleNewBoardBody = (event: MouseEvent) => {
	if (event.ctrlKey) {
		navigate("/board");
	}
	isOpenBoardBodyOpen = false;
	isSettingsBodyOpen = false;
	isNewBoardBodyOpen = !isNewBoardBodyOpen;
	setIsAMenuOptionOpen(isNewBoardBodyOpen);
};
const toggleOpenBoardBody = () => {
	isNewBoardBodyOpen = false;
	isSettingsBodyOpen = false;
	isOpenBoardBodyOpen = !isOpenBoardBodyOpen;
	setIsAMenuOptionOpen(isOpenBoardBodyOpen);
};
const toggleSettingsBody = () => {
	isNewBoardBodyOpen = false;
	isOpenBoardBodyOpen = false;
	isSettingsBodyOpen = !isSettingsBodyOpen;
	setIsAMenuOptionOpen(isSettingsBodyOpen);
};

const options = () => [
	{
		text: "new board",
		iconName: "add",
		onclick: toggleNewBoardBody,
		bodyTitle: "Create a new board",
		isBodyOpen: isNewBoardBodyOpen,
		bodyComponent: CreateNewBoardOptionBody,
	},
	{
		text: "open board",
		iconName: "folder",
		onclick: toggleOpenBoardBody,
		bodyTitle: "Recent boards",
		isBodyOpen: isOpenBoardBodyOpen,
		bodyComponent: OpenBoardBody,
	},
	{
		text: "settings",
		iconName: "settings",
		onclick: toggleSettingsBody,
		bodyTitle: "General Settings",
		isBodyOpen: isSettingsBodyOpen,
		bodyComponent: SettingsOptionBody,
	},
	{
		text: "quit",
		iconName: "exit_to_app",
		onclick: quitApp,
	},
];

function quitApp() {
	Quit();
}
</script>

<nav>
    <ul>
        {#each options() as option (option.text)}
            <StartMenuOptionsItem {...option}  />
        {/each}
    </ul>
</nav>

<style>
    nav{
        display: grid;
        place-items: center;
    }

    ul{
        list-style: none;
        width: 100%;
    }
</style>