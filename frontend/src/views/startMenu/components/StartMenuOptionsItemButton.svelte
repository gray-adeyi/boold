<script lang="ts">
type Props = {
	readonly onclick: (event?: MouseEvent) => void;
	readonly iconName: string;
	readonly buttonText: string;
};
let props: Props = $props();
</script>

<button class="button" onclick={props.onclick}>
    <i class="material-icon option-icon">{props.iconName}</i>
    <span class="bar"></span>
    <span class="button-text">{props.buttonText}</span>
</button>

<style>
    .button {
        display: flex;
        place-items: center;
        gap: 30px;
        background-color: transparent;
        color: var(--color-app-gray);
        border: none;
        font-size: 1.5rem;
        padding: 30px;
        font-family: var(--font-ubuntu);
        cursor: pointer;
        transition: color .2s ease-in-out;

        &:hover{
            color: var(--color-app-white);
            .bar{
                background-color: var(--color-app-white);
            }
        }
    }

    .option-icon{
        font-size: 2.5rem;
    }

    .bar{
        width: 3px;
        height: 35px;
        background-color: var(--color-app-gray);
        transition: background-color .2s ease-in-out;
    }

    .button-text{
        text-transform: uppercase;
    }
</style>