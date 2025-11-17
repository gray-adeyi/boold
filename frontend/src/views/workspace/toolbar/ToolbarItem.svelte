<script lang="ts">
    import { Portal } from "@jsrob/svelte-portal";

    type Props = {
        text?: string;
        icon?: string;
        tip: string;
        tipSubtext?: string;
        onclick: () => void;
        onrightclick?: () => void;
    };
    const { text, icon, tip, tipSubtext, onclick, onrightclick }: Props =
        $props();

    let isTipVisible = $state(false);
    let buttonEl: HTMLButtonElement | null = $state(null);

    const setTipLeftOffset = (el: HTMLDivElement) => {
        if (!buttonEl) return;
        const rect = buttonEl.getBoundingClientRect();
        const leftPos = rect.left + rect.width / 2;
        el.style.left = `${leftPos}px`;
        // el.style.bottom = `${rect.top}px`
    };

    const handleRightClick = (event: MouseEvent) => {
        event.preventDefault();
        if (!onrightclick) return;
        onrightclick();
    };
</script>

<li class="container">
    <Portal target="#workspace-portal-target">
        {#if isTipVisible}
            <div class="tip" {@attach setTipLeftOffset}>
                <span class="tip-text">{tip}</span>
                {#if tipSubtext}
                    <span class="tip-subtext">{tipSubtext}</span>
                {/if}
            </div>
        {/if}
    </Portal>
    <button
        class="button"
        bind:this={buttonEl}
        {onclick}
        oncontextmenu={handleRightClick}
        onmouseenter={() => (isTipVisible = true)}
        onmouseleave={() => (isTipVisible = false)}
    >
        {#if text}
            <span class="button-text">{text}</span>
        {/if}
        {#if icon}
            <i class="material-icon icon">{icon}</i>
        {/if}
    </button>
</li>

<style>
    .container {
        --size: 50px;
        width: var(--size);
        height: var(--size);
        position: relative;
        display: flex;
        place-content: center;

        &:first-of-type {
            .button {
                border-top-left-radius: 5px;
            }
        }
        &:last-of-type {
            .button {
                border-top-right-radius: 5px;
            }
        }
    }

    .tip {
        position: absolute;
        background: var(--color-app-black);
        color: var(--color-app-white);
        padding: 10px;
        font-size: 0.875rem;
        max-width: 6.25rem;
        text-align: center;
        box-shadow: 0 0 20px rgba(0 0 0 / 0.25);
        border-radius: 5px;
        bottom: 92px;
        transform: translate(-50%);

        &::before {
            --size: 15px;
            content: "";
            position: absolute;
            width: var(--size);
            height: var(--size);
            transform: rotate(-45deg);
            left: calc(50% - 7px);
            bottom: -8px;
            background: var(--color-app-black);
        }
    }

    .tip-text {
        display: block;
    }

    .tip-subtext {
        color: var(--color-app-gray-alt-2);
        font-size: 0.625rem;
    }

    .button {
        flex: 1;
        border: none;
        background: var(--color-app-black);
        color: var(--color-app-gray-alt-2);
        font-size: 1rem;
        font-weight: 700;
        width: 400px;
        /*padding-block: 18px;*/

        cursor: pointer;
        /*transition: color background-color 0.2s;*/

        &:hover {
            background: #222;
            color: var(--color-app-white);
        }
    }

    .icon {
        font-weight: 400;
        font-size: 1.5rem;
    }
</style>
