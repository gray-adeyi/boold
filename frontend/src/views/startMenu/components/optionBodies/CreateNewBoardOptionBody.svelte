<script lang="ts">
    import DefaultButton from "$/lib/components/DefaultButton.svelte";
    import MacCmdKeyIcon from "$/assets/icons/mac-command.svg?component";
    import MouseLeftButtonIcon from "$/assets/icons/mouse-left-button.svg?component";
    import StartMenuOptionsItemBody from "$/views/startMenu/components/StartMenuOptionsItemBody.svelte";

    type Props = {
        readonly title?: string;
        readonly isVisible?: boolean;
    }

    const props: Props = $props()

</script>

<StartMenuOptionsItemBody title={props.title} isVisible={props.isVisible}>
    <div class="input-and-tip-container">
        <input placeholder="Board Name"/>
        <p class="tip">This board will be saved as new-board.board</p>
    </div>

    <p class="hint">Hint:
        <MacCmdKeyIcon width="24" height="24"  /> +
        <MouseLeftButtonIcon width="24" height="24" />
        (Cmd or Ctrl + Click) Starts a new board in sandbox mode
    </p>
    <div class="actions-container">
        <DefaultButton text="Cancel"/>
        <DefaultButton text="Create"/>
    </div>
</StartMenuOptionsItemBody>

<style>
    .input-and-tip-container {
        display: flex;
        flex-direction: column;
        place-content: center;
        margin-block-end: 1rem;

        &:focus-within .tip {
            opacity: 1;
        }
    }

    input {
        border: none;
        padding: .625rem;
        background: transparent;
        border-bottom: 2px solid var(--color-app-gray);
        outline: none;
        font-family: var(--font-ubuntu);
        font-size: 1.25rem;
        transition: border-bottom-color .3s;

        /*&::selection{*/
        /*    background: var(--color-app-black);*/
        /*    color: var(--color-app-white);*/
        /*}*/

        &::placeholder {
            color: var(--color-app-gray);
        }

        &:focus {
            border-bottom: 2px solid var(--color-app-black);
        }


    }

    .tip {
        padding: .625rem;
        background: var(--color-app-black-alt);
        border-radius: 5px;
        position: relative;
        margin-block-start: 12px;
        font-size: .9375rem;
        opacity: 0;
        transition: opacity .3s;

        &::before {
            --size: 15px;
            content: '';
            position: absolute;
            width: var(--size);
            height: var(--size);
            top: -7px;
            left: 50%;
            background-color: var(--color-app-black-alt);
            transform: rotate(45deg);
        }
    }

    .icon{
        fill: var(--color-app-black);
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