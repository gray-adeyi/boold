<script lang="ts">
    import type { FloatingMenuOption } from "$/types";

    type Props = {
      menuOptions: FloatingMenuOption[];
    }
    
    const {menuOptions}: Props = $props()
    
    const createKeydownHandler = (action: FloatingMenuOption['action']) => {
      return (event: KeyboardEvent) => {
        event.preventDefault()
        if(event.key === 'Enter' || event.key = ' ') action()
      }
    }


</script>

<ul class="menu">
    {#each menuOptions as option (option.icon)}
        <li role="button" onclick={option.action} onkeydown={createKeydownHandler(option.action)} tabindex="0" class="menu-item">
            <i class="material-icon icon">{option.icon}</i>
            <div class="text-container">
                <span class="display">{option.display}</span>
                {#if option?.shortcut}
                    <span class="shortcut">{option.shortcut}</span>
                {/if}
            </div>
        </li>
    {/each}
</ul>

<style>
    .menu {
        position: absolute;
        top: -314px;
        left: -10px;
        background-color: var(--color-app-black);
        color: var(--color-app-white);
        border-radius: 5px;
        font-size: 15px;
        width: 240px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
    }

    .menu-item {
        display: flex;
        gap: 20px;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    }

    .icon {
        color: var(--color-app-gray);
    }

    .text-container {
        display: flex;
        justify-content: space-between;
        flex: 1;
    }

    .shortcut {
        color: var(--color-app-gray);
    }
</style>
