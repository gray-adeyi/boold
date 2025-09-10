<script lang="ts">
    import StartMenuOptionsItemButton from "$/views/startMenu/components/StartMenuOptionsItemButton.svelte";
    import StartMenuOptionsItemDialog from "$/views/startMenu/components/StartMenuOptionsItemDialog.svelte";
    import type {Snippet} from "svelte";

    type Props = {
        readonly onclick: (event?: MouseEvent) => void;
        readonly iconName: string;
        readonly text: string;
        readonly isDialogOpen?: boolean;
        readonly dialogTitle?: string;
        readonly dialogComponent?: Snippet;
    }

    const props: Props = $props()
</script>

<li>
    <div class="button-container">
    <StartMenuOptionsItemButton onclick={props.onclick} iconName={props.iconName} buttonText={props.text}/>
    </div>

    <StartMenuOptionsItemDialog title={props.dialogTitle} isVisible={props.isDialogOpen}
                                children={props.dialogComponent} />
</li>

<style>
    li {
        width: 100%;
        position: relative;
    }

    .button-container {
        margin-inline-start: calc(50% - 160px);
    }

</style>