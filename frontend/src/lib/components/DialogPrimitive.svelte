<script lang="ts">
    import type {Snippet} from "svelte";

    type Props = {
	children: Snippet;
	onclose: () => void;
	actionType?: "closeOnly" | "okCancel";
	title: string;
	closeButtonText?: string;
	okButtonText?: string;
	cancelButtonText?: string;
	onok?: () => void;
	oncancel?: () => void;
};

const {
	children,
	onclose,
	actionType = "closeOnly",
	title,
	closeButtonText = "close",
	okButtonText = "ok",
	cancelButtonText = "cancel",
	onok,
	oncancel,
}: Props = $props();

(() => {
    if (actionType === "okCancel" && !onok && !oncancel) {
        throw new Error(
            'onok and oncancel callback required if actionType === "okCancel"',
        );
    }
})()
</script>

<dialog class="dialog" open>
    <div class="mask">
        <div class="main">
            <div class="header">
                <h1 class="title">{title}</h1>
                <button class="close-button" onclick={onclose}
                    ><i class="material-icon">close</i></button
                >
            </div>
            <!-- body -->
            {@render children()}
            <div class="actions">
                {#if actionType === "closeOnly"}
                    <button onclick={onclose} class="action-button"
                        >{closeButtonText}</button
                    >
                {/if}
                {#if actionType === "okCancel"}
                    <button class="action-button" onclick={onok}
                        >{okButtonText}</button
                    >
                    <button class="action-button" onclick={oncancel}
                        >{cancelButtonText}</button
                    >
                {/if}
            </div>
        </div>
    </div>
</dialog>

<style>
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(136 136 136 / .7);
    }

    .main {
        margin-block-start: 16%;
        margin-inline: auto;
        max-width: 400px;
        background-color: var(--color-app-black);
        color: var(--color-app-white);
        border-radius: 5px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-inline: 8px;
        padding-block-start: 15px;
    }
    .title {
        text-align: center;
        text-transform: capitalize;
        width: 100%;
        font-size: 26px;
        font-weight: 400;
    }

    .close-button {
        padding: 10px;
        cursor: pointer;
        transform: rotateZ(0deg) scale(1);
        transition: transform 0.2s;
        border: none;
        background: none;
        color: var(--color-app-gray);

        &:hover {
            font-weight: 800;
            transform: rotateZ(90deg) scale(1.2);
        }
    }

    .actions {
        display: flex;
        place-content: center;
        padding-block: 20px;
    }
    
    .action-button {
        background: rgba(255 255 255 / .2);
        box-shadow:0 3px 0 0 rgba(255 255 255 / .1);
        border: none;
        color: var(--color-app-white);
        padding: 10px;
        cursor: pointer;
        text-transform: capitalize;
        min-width: 100px;
        font-size: .9375rem;
        transition: box-shadow .1s background-color .1s transform .1s;
        
        &:hover{
            background: rgba(255 255 255 / .3);
            box-shadow: 0 3px 0 0 rgba(255 255 255 / .2);
        }
        
        &:active{
            box-shadow: 0 0 0 0 var(--color-app-black);
            transform: translateY(3px);
        }
    }
</style>
