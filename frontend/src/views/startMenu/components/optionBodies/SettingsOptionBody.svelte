<script lang="ts" >
    import DefaultButton from "$/lib/components/DefaultButton.svelte";
    import DefaultToggleOption from "$/lib/components/DefaultToggleOption.svelte";
    import StartMenuOptionsItemBody from "$/views/startMenu/components/StartMenuOptionsItemBody.svelte";
    type Props = {
        readonly title?: string;
        readonly isVisible?: boolean;
    }

    const props: Props = $props()
</script>


<StartMenuOptionsItemBody title={props.title} isVisible={props.isVisible}>
    <div class="toggled-settings">
        <DefaultToggleOption />
        <DefaultToggleOption />
        <DefaultToggleOption />
    </div>

    <div>
        <DefaultButton text="Clear localStorage" variant="danger" />
    </div>

    <div class="actions-container">
        <DefaultButton text="Cancel"/>
        <DefaultButton text="Ok"/>
    </div>
</StartMenuOptionsItemBody>

<style>
    .toggled-settings{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .actions-container {
        display: flex;
        place-items: center;
        gap: 20px;
    }
</style>