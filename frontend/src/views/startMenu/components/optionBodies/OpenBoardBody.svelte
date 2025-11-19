<script lang="ts">
import DefaultButton from "$/lib/components/DefaultButton.svelte";
import RecentBoardItem from "$/views/startMenu/components/optionBodies/RecentBoardItem.svelte";
import StartMenuOptionsItemBody from "$/views/startMenu/components/StartMenuOptionsItemBody.svelte";

type Props = {
	readonly title?: string;
	readonly isVisible?: boolean;
};

const props: Props = $props();
</script>

<StartMenuOptionsItemBody title={props.title} isVisible={props.isVisible}>
    <ul class="recent-boards-container">
        <RecentBoardItem />
        <RecentBoardItem />
        <RecentBoardItem />
        <RecentBoardItem />
        <RecentBoardItem />
    </ul>
    <p class="hint">Hint: To open boards, paste a .board file in the saves folder.</p>

    <div class="actions-container">
        <DefaultButton text="Open saves folder"/>
        <DefaultButton text="Connect to boold server"/>
    </div>
</StartMenuOptionsItemBody>

<style>
    .recent-boards-container{
        list-style: none;
        max-height: 200px;
        overflow-y: auto;
    }
    .hint {
        color: var(--color-app-gray);
        margin-block-end: 1rem;
        font-family: var(--font-ubuntu);
    }

    .actions-container {
        display: flex;
        place-items: center;
        gap: 20px;
    }
</style>