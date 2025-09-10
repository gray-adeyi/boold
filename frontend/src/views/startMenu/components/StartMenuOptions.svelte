<script lang="ts">
    import StartMenuOptionsItem from "$/views/startMenu/components/StartMenuOptionsItem.svelte";
    import {Quit} from '$runtime'
    import {navigate} from "$/router";
    import {createNewBoardDialog} from "./dialogs/CreateNewBoardDialog.svelte";


    let isNewBoardDialogOpen = $state(false);
    let isOpenBoardDialogOpen = $state(false);
    let isSettingsDialogOpen = $state(false);

    const toggleNewBoardDialog = (event: MouseEvent) => {
        if(event.ctrlKey){
            navigate('/workspace')
        }
        isOpenBoardDialogOpen = false
        isSettingsDialogOpen = false
        isNewBoardDialogOpen = !isNewBoardDialogOpen
    }
    const toggleOpenBoardDialog = () => {
        isNewBoardDialogOpen = false
        isSettingsDialogOpen = false
        isOpenBoardDialogOpen = !isOpenBoardDialogOpen }
    const toggleSettingsDialog = () => {
        isNewBoardDialogOpen = false
        isOpenBoardDialogOpen = false
        isSettingsDialogOpen = !isSettingsDialogOpen}

    const options = () => [
        {
            text: "new board",
            iconName: "add",
            onclick: toggleNewBoardDialog,
            dialogTitle: 'Create a new board',
            isDialogOpen: isNewBoardDialogOpen,
            dialogComponent: createNewBoardDialog,
        },
        {
            text: "open board",
            iconName: "folder",
            onclick: toggleOpenBoardDialog,
            dialogTitle: 'Open an existing board',
            isDialogOpen: isOpenBoardDialogOpen,
        },
        {
            text: "settings",
            iconName: "settings",
            onclick: toggleSettingsDialog,
            dialogTitle: 'Settings',
            isDialogOpen: isSettingsDialogOpen,
        },
        {
            text: "quit",
            iconName: "exit_to_app",
            onclick: quitApp,
        }
    ]

    function quitApp(){
        Quit()
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