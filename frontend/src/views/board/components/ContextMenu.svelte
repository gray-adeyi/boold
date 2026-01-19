<script lang="ts">
    import {
        copyToClipboard,
        hideContextMenu,
        pasteFromClipboard,
        state as boardStoreState,
    } from "$/stores/boardStore.svelte";
    import {
        findAllWiresInPos,
        findComponentByPos,
        findComponentPinByPos,
        findWireByPos, findWiresInUserSelection, removeComponent, removeWire
    } from "$/lib/logicComponents/componentManipulation.svelte";
    import CustomComponent from "$/lib/logicComponents/CustomComponent.svelte";

    let x = $state(boardStoreState.contextMenu.pos.x)
    let y = $state(boardStoreState.contextMenu.pos.y)

    const allOptions = [
        {
            displayName: 'Copy',
            iconName: 'content_copy',
            shortcut: 'Ctrl + C',
            action: () => {
                if(boardStoreState.userSelection){
                    copyToClipboard(boardStoreState.userSelection.components,boardStoreState.userSelection.wires,boardStoreState.userSelection)
                }
                const found = findComponentByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState)
                if (found){
                    copyToClipboard([found],[],null)
                }
            },
            isVisibleFn: () => findComponentByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState) || boardStoreState.userSelection,
            isDisabledFn: () => false,
        },
        {
            displayName: 'Paste',
            iconName: 'content_paste',
            shortcut: 'Ctrl + V',
            action: () => pasteFromClipboard(contextMenuPos.x,contextMenuPos.y),
            isVisibleFn: () => !findComponentByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState) && !findComponentPinByPos(null,null,boardStoreState) && ! findWireByPos(null,null,boardStoreState) && !boardStoreState.userSelection,
            isDisabledFn: () => boardStoreState.clipboard.components.length === 0 && boardStoreState.clipboard.wires.length === 0,
        },
        {
            displayName: 'Merge wires',
            iconName: 'merge_type',
            shortcut: 'Q',
            action: () => console.log('Merge wires'),
            isVisibleFn: () => findAllWiresInPos(contextMenuPos.x,contextMenuPos.y,boardStoreState).length >1,
            isDisabledFn: () => false,
        },
        {
            displayName: 'Edit',
            iconName: 'mode_edit',
            shortcut: 'E',
            action: () => console.log('Edit'),
            isVisibleFn: () => {
                return findComponentByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState)
            },
            isDisabledFn: () => false,
        },
        {
            displayName: 'Edit',
            iconName: 'mode_edit',
            shortcut: 'E',
            action: () => console.log('Edit'),
            isVisibleFn: () => {
                return findComponentPinByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState)
            },
            isDisabledFn: () => false,
        },
        {
            displayName: 'Edit color',
            iconName: 'color_lens',
            shortcut: 'C',
            action: () => console.log('Edit color'),
            isVisibleFn: () => {
                const wire = findWireByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState)
                const component = findComponentByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState)
                return (wire || (component && component.color)) && !boardStoreState.userSelection;
            },
            isDisabledFn: () => false,
        },
        {
            displayName: 'Edit color',
            iconName: 'color_lens',
            shortcut: 'C',
            action: () => console.log('Edit color'),
            isVisibleFn: () => {
                return boardStoreState.userSelection && boardStoreState.userSelection.components && (
                    findWiresInUserSelection(null,null,null,null, boardStoreState).length > 0 || boardStoreState.components.find(a => a.color)
                )
            },
            isDisabledFn: () => false,
        },
        {
            displayName: 'Open',
            iconName: 'open_in_new',
            shortcut: 'O',
            action: () => console.log('Open'),
            isVisibleFn: () => {
                const component = findComponentByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState)
                return component && component instanceof CustomComponent
            },
            isDisabledFn: () => false,
        },
        {
            displayName: 'Save component',
            iconName: 'file_download',
            shortcut: 'Shift+R',
            action: () => console.log('Save component'),
            isVisibleFn: () => {
                const component = findComponentByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState)
                return component && component instanceof CustomComponent && !boardStoreState.userSelection;
            },
            isDisabledFn: () => false,
        },
        {
            displayName: 'Rotate',
            iconName: 'rotate_right',
            shortcut: 'R',
            action: () => {
                const component = findComponentByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState)
                if (component) component.rotate()
            },
            isVisibleFn: () => {
                const component = findComponentByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState)
                return component && component.rotate && !boardStoreState.userSelection;
            },
            isDisabledFn: () => false,
        },
        {
            displayName: 'View connections',
            iconName: 'compare_arrows',
            shortcut: '',
            action: () => console.log('View connections'),
            isVisibleFn: () => {
                const component = findComponentByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState)
                return component && !boardStoreState.userSelection;
            },
            isDisabledFn: () => false,
        },
        {
            displayName: 'Set waypoint',
            iconName: 'my_location',
            shortcut: 'Shift + S',
            action: () => console.log('Set waypoint'),
            isVisibleFn: () => !boardStoreState.userSelection,
            isDisabledFn: () => false,
        },
        {
            displayName: 'Go to waypoint',
            iconName: 'redo',
            shortcut: 'Shift + W',
            action: () => console.log('Go to waypoint'),
            isVisibleFn: () => !boardStoreState.userSelection,
            isDisabledFn: () => false,
        },
        {
            displayName: 'Componentize',
            iconName: "memory",
            shortcut: 'Shift + C',
            action: () => console.log('Componentize'),
            isVisibleFn: () => !boardStoreState.userSelection && boardStoreState.components.length > 0,
            isDisabledFn: () => false,
        },
        {
            displayName: 'Remove',
            iconName: 'delete',
            shortcut: 'Delete',
            action: () => {
                const component = findComponentByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState)
                if(component) removeComponent(component,boardStoreState)
            },
            isVisibleFn: () => {
                const component = findComponentByPos(contextMenuPos.x,contextMenuPos.y,boardStoreState)
                return component && !boardStoreState.userSelection;
            },
            isDisabledFn: () => false,
        },
        {
            displayName: 'Remove',
            iconName: 'delete',
            shortcut: 'Delete',
            action: () => {
                const wire = findWireByPos(contextMenuPos.x, contextMenuPos.y,boardStoreState)
                if(wire) removeWire(wire, boardStoreState)
            },
            isVisibleFn: () => {
                const wire = findWireByPos(contextMenuPos.x, contextMenuPos.y,boardStoreState)
                return wire && !boardStoreState.userSelection;
            },
            isDisabledFn: () => false,
        },
    ]

    // These are the options that are visible in the context menu based on the context
    // where the user right-clicked. e.g. the options shown when the user right-clicks
    // on the board (canvas) will differ from the options shown when the user right-clicks
    // on a component in the canvas.
    const currentOptions = $derived(allOptions.filter(o => o.isVisibleFn()))

    const contextMenuPos = $derived.by(() => {
        const g = {x: Math.round(x), y: Math.round(y)}
        console.log(g)
        return g
    })

    const getDoActionAndHideContextmenuFn = (action: () => void) => () => {
        action();
        hideContextMenu();
    }

    // Prevents the context menu from extending outside the board
    function adjustPos(node: HTMLUListElement) {
        if (!boardStoreState.canvas) return
        const boardRect = boardStoreState.canvas.getBoundingClientRect();
        const menuRect = node.getBoundingClientRect();
        x = Math.min(boardRect.right - menuRect.width, Math.max(boardRect.left, menuRect.x));
        y = Math.min(boardRect.bottom - menuRect.height, Math.max(boardRect.top, menuRect.y));
    }
</script>
<ul {@attach adjustPos}
    style={`--x-coord: ${x}px; --y-coord: ${y}px`}
    class="container">
    {#each currentOptions as option (option.displayName)}
        <li>
            <button disabled={option.isDisabledFn()} class="menu-item" onclick={getDoActionAndHideContextmenuFn(option.action)}>
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
    .container {
        position: fixed;
        background: var(--color-app-black);
        list-style: none;
        padding: 0;
        margin: 0;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, .25);
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

            .material-icon {
                color: var(--color-app-white);
            }
        }

        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        &:first-of-type {
            border-start-start-radius: 5px;
            border-start-end-radius: 5px;
        }

        &:last-of-type {
            border-end-start-radius: 5px;
            border-end-end-radius: 5px;
        }
    }

    .name-and-shortcut-container {
        display: flex;
        justify-content: space-between;
        flex: 1;
        align-items: center;
        padding-inline-start: 0.625rem;
    }

    .material-icon {
        color: var(--color-app-gray);
        white-space: nowrap;
    }

    .shortcut {
        color: var(--color-app-gray);
        padding-inline-start: 0.625rem;
    }
</style>

