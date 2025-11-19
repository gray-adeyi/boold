<script lang="ts">
type Props = {
	onclick: (event?: MouseEvent) => void;
	text: string;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	variant?: "default" | "danger";
};
const {
	type = "button",
	onclick,
	text,
	disabled = false,
	variant = "default",
}: Props = $props();
</script>

<button class={['button',{'button--danger': variant === 'danger'}]} {type} {onclick} {disabled}>{text}</button>

<style>
    .button {
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

    .button--danger{
        background-color: var(--color-app-red);
    }
</style>