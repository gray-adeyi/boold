<script lang="ts">
    type Props = {
      materialIcon: string;
      text?: string;
      onclick: ()  => void;
    }
  const {materialIcon, text, onclick}: Props = $props()
</script>

<button {onclick}>
    <i class="material-icon">{materialIcon}</i>
    {#if text}
    <span>{text}</span>
    {/if}
</button>

<style>
    button {
        display: flex;
        place-items: center;
        gap: 3px;
        cursor: pointer;
        color: var(--color-app-white);
        background-color: var(--color-app-black);
        border-radius: 5px;
        border: none;
        padding: 8px;
        box-shadow: 0 0 20px rgba(0 0 0 / .25);
        transition: background-color .2s;
        
        &:hover{
            background-color: var(--color-app-gray-alt);
        }
    }
</style>