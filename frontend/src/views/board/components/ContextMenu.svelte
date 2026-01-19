<script lang="ts">
    import {hideContextMenu, state as boardStoreState,} from "$/stores/boardStore.svelte";

    const allOptions = [
        {displayName: 'Copy',
            iconName: 'content_copy',
            shortcut: 'Ctrl + C',
            action: () => console.log('Copy'),
            isVisibleFn: () => true,
        },
        {
            displayName: 'Paste',
            iconName: 'content_paste',
            shortcut: 'Ctrl + V',
            action: () => console.log('Paste'),
            isVisibleFn: () => true,
        },
        {
            displayName: 'Merge wires',
            iconName: 'merge_type',
            shortcut: 'Q',
            action: () => console.log('Merge wires'),
            isVisibleFn: () => true,
        },
        {
            displayName: 'Edit',
            iconName: 'mode_edit',
            shortcut: 'E',
            action: () => console.log('Edit'),
            isVisibleFn: () => true,
        },
        {
            displayName: 'Edit color',
            iconName: 'color_lens',
            shortcut: 'C',
            action: () => console.log('Edit color'),
            isVisibleFn: () => true,
        },
        {
            displayName: 'Open',
            iconName: 'open_in_new',
            shortcut: 'O',
            action: () => console.log('Open'),
            isVisibleFn: () => true,
        },
        {
            displayName: 'Save component',
            iconName: 'file_download',
            shortcut: 'Shift+R',
            action: () => console.log('Save component'),
            isVisibleFn: () => true,
        },
        {
            displayName: 'Rotate',
            iconName: 'rotate_right',
            shortcut: 'R',
            action: () => console.log('Rotate'),
            isVisibleFn: () => true,
        },
        {
            displayName: 'View connections',
            iconName: 'compare_arrows',
            shortcut: '',
            action: () => console.log('View connections'),
            isVisibleFn: () => true,
        },
        {
            displayName: 'Set waypoint',
            iconName: 'my_location',
            shortcut: 'Shift + S',
            action: () => console.log('Set waypoint'),
            isVisibleFn: () => true,
        },
        {
            displayName: 'Go to waypoint',
            iconName: 'redo',
            shortcut: 'Shift + W',
            action: () => console.log('Go to waypoint'),
            isVisibleFn: () => true,
        },
        {
            displayName: 'Componentize',
            iconName: "memory",
            shortcut: 'Shift + C',
            action: () => console.log('Componentize'),
            isVisibleFn: () => true,
        },
        {
            displayName: 'Remove',
            iconName: 'delete',
            shortcut: 'Delete',
            action: () => console.log('Remove'),
            isVisibleFn: () => true,
        }
    ]

    const currentOptions = $derived(allOptions.filter(o => o.isVisibleFn()))

    const getDoActionAndHideContextmenuFn = (action: () => void) => () => {
        action();
        hideContextMenu();
    }

    // Prevents the context menu from extending outside the board
    function adjustPos(node: HTMLUListElement) {
        if(!boardStoreState.canvas) return
        const boardRect = boardStoreState.canvas.getBoundingClientRect();
        const menuRect = node.getBoundingClientRect();
        boardStoreState.contextMenu.pos.x = Math.min(boardRect.right - menuRect.width, Math.max(boardRect.left, menuRect.x));
        boardStoreState.contextMenu.pos.y = Math.min(boardRect.bottom - menuRect.height, Math.max(boardRect.top, menuRect.y));
        node.style.setProperty('--x-coord', `${boardStoreState.contextMenu.pos.x}px`);
        node.style.setProperty('--y-coord', `${boardStoreState.contextMenu.pos.y}px`);
    }
</script>
<ul {@attach adjustPos} style={`--x-coord: ${boardStoreState.contextMenu.pos.x}px; --y-coord: ${boardStoreState.contextMenu.pos.y}px`} class="container">
    {#each currentOptions as option (option.displayName)}
    <li >
        <button class="menu-item" onclick={getDoActionAndHideContextmenuFn(option.action)}>
            <i class="material-icon">{option.iconName}</i>
            <span class="name-and-shortcut-container">
                <span class="name">{option.displayName}</span>
                <span class="shortcut">{option.shortcut}</span>
            </span>
        </button>
    </li>
        {/each}
</ul>

<style>
    .container{
        position: fixed;
        background: var(--color-app-black);
        list-style: none;
        padding: 0;
        margin: 0;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,.25);
        transition: opacity .2s;


        top: var(--y-coord);
        left: var(--x-coord);
    }

    .menu-item {
        display: flex;
        align-items: center;
        font-size: 0.9375rem;
        color: var(--color-app-white);
        white-space: nowrap;
        cursor: pointer;
        padding: 0.5rem;
        border: none;
        background: transparent;
        width: 100%;

        &:hover {
            background: rgba(255 255 255 / .1);

            .material-icon{
                color: var(--color-app-white);
            }
        }

        &:disabled{
            cursor: not-allowed;
            opacity: 0.5;
        }

        &:first-of-type{
            border-start-start-radius: 5px;
            border-start-end-radius: 5px;
        }

        &:last-of-type{
            border-end-start-radius: 5px;
            border-end-end-radius: 5px;
        }
    }

    .name-and-shortcut-container{
        display: flex;
        justify-content: space-between;
        flex: 1;
        align-items: center;
        padding-inline-start: 0.625rem;
    }

    .material-icon{
        color: var(--color-app-gray);
        white-space: nowrap;
    }

    .shortcut{
        color: var(--color-app-gray);
        padding-inline-start: 0.625rem;
    }
</style>

