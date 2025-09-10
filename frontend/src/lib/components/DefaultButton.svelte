<script lang="ts">

    type Props = {
        onclick: (event?: MouseEvent) => void,
         text: string,
         disabled?: boolean,
         type?: "button" | "submit" | "reset"
    }
    const {type = "button", onclick, text, disabled=false} : Props = $props();
</script>

<button {type} {onclick} {disabled}>{text}</button>

<style>
    button {
        background-color: var(--color-app-black);
        color: var(--color-app-white);
        font-family: var(--font-ubuntu);
        font-size: 1rem;
        padding: 12px 25px;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: var(--color-app-gray-alt);
        }

        &:active {
            background-color: var(--color-app-black);
        }

        &:disabled {
            background-color: var(--color-app-black-alt);
            cursor: not-allowed;
        }
    }
</style>