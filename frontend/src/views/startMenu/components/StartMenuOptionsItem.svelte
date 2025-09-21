<script lang="ts">
    import StartMenuOptionsItemButton from "$/views/startMenu/components/StartMenuOptionsItemButton.svelte";
    import type {Component} from "svelte";

    type Props = {
        readonly onclick: (event?: MouseEvent) => void;
        readonly iconName: string;
        readonly text: string;
        readonly isBodyOpen?: boolean;
        readonly bodyTitle?: string;
        readonly bodyComponent?: Component;
    }

    const props: Props = $props()
</script>

<li>
    <div class="actions-container">
    <StartMenuOptionsItemButton onclick={props.onclick} iconName={props.iconName} buttonText={props.text}/>
    </div>

    {#if props.bodyComponent}
    <props.bodyComponent title={props.bodyTitle} isVisible={props.isBodyOpen} />
        {/if}
</li>

<style>
    li {
        width: 100%;
        position: relative;
    }

    .actions-container {
        margin-inline-start: calc(50% - 160px);
    }

</style>