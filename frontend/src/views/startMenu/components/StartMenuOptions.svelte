<script>
    import StartMenuOptionsItem from "$/views/startMenu/components/StartMenuOptionsItem.svelte";
    import {Quit} from '$runtime'

    let isNewBoardDialogOpen = $state(false);
    let isOpenBoardDialogOpen = $state(false);
    let isSettingsDialogOpen = $state(false);

    const toggleNewBoardDialog = () => { isNewBoardDialogOpen = !isNewBoardDialogOpen }
    const toggleOpenBoardDialog = () => { isOpenBoardDialogOpen = !isOpenBoardDialogOpen }
    const toggleSettingsDialog = () => { isSettingsDialogOpen = !isSettingsDialogOpen}

    const options = [
        {
            text: "new board",
            iconName: "add",
            onclick: toggleNewBoardDialog,
        },
        {
            text: "open board",
            iconName: "folder",
            onclick: toggleOpenBoardDialog,
        },
        {
            text: "settings",
            iconName: "settings",
            onclick: toggleSettingsDialog,
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
        {#each options as option (option.text)}
            <StartMenuOptionsItem {...option} />
        {/each}
    </ul>
</nav>

<style>
    nav{
        display: grid;
        place-content: center;
    }

    ul{
        list-style: none;
    }
</style>