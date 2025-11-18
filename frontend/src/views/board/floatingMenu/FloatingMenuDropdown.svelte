<script lang="ts">
    type MenuOption = {
        icon: string;
        display: string;
        shortcut?: string;
        action: () => void;
    };
    const menuOptions: MenuOption[] = [
        {
            icon: "add",
            display: "New board",
            shortcut: "Ctrl+N",
            action: () => {},
        },
        {
            icon: "folder",
            display: "Open board",
            shortcut: "Ctrl+O",
            action: () => {},
        },
        {
            icon: "save",
            display: "Save board",
            shortcut: "Ctrl+S",
            action: () => {},
        },
        {
            icon: "featured_play_list",
            display: "Open console",
            shortcut: "Shift+T",
            action: () => {},
        },
        {
            icon: "settings",
            display: "Settings",
            shortcut: "Ctrl+Shift+S",
            action: () => {},
        },
        {
            icon: "help",
            display: "Open tutorial",
            shortcut: "F1",
            action: () => {},
        },
        {
            icon: "exit_to_app",
            display: "Quit",
            action: () => {},
        },
    ];
</script>

<ul class="menu">
    {#each menuOptions as option (option.icon)}
        <li class="menu-item">
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
