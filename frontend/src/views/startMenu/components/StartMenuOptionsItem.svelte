<script lang="ts">
    import StartMenuOptionsItemButton from "$/views/startMenu/components/StartMenuOptionsItemButton.svelte";
    import StartMenuOptionsItemDialog from "$/views/startMenu/components/StartMenuOptionsItemDialog.svelte";
    import type {Snippet} from "svelte";

    type Props = {
        readonly onclick: () => void;
        readonly iconName: string;
        readonly text: string;
        readonly isDialogOpen?: boolean;
        readonly dialogTitle?: string;
        readonly dialogContent?: Snippet;
    }

    const props: Props = $props()
</script>

<li>
    <StartMenuOptionsItemButton onclick={props.onclick} iconName={props.iconName} buttonText={props.text} />
    <StartMenuOptionsItemDialog title={props.dialogTitle} isVisible={props.isDialogOpen} children={props.dialogContent} />
</li>

<style>
    li{
        padding: 30px;
    }
</style>