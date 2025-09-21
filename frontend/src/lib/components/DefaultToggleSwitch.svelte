<script lang="ts">
    // type Props = {
    //     checked: boolean;
    //     onToggle: (checked: boolean) => void;
    // }
    // const {checked, onToggle}: Props = $props();
    // const toggle = () => {}
    let checked = $state(false);
    const ariaChecked = $derived(checked ? 'true' : 'false');

    const toggle = () => {
        checked = !checked
    }
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            toggle();
        }
    }
</script>

<div class={["switch",{'switch--checked': checked}]} role="switch" onclick={toggle} onkeydown={handleKeyDown}
     aria-checked={ariaChecked} tabindex="0">
    <span class="slider"></span>
</div>

<style>
    .switch {
        display: flex;
        width: 36px;
        height: 22px;
        background: var(--color-app-gray);
        padding: 4px;
        cursor: pointer;
        transition: background .2s;
    }

    .slider {
        --size: 14px;
        width: var(--size);
        height: var(--size);
        background: var(--color-app-white);
        transition: transform .2s;
    }

    .switch--checked {
        background: var(--color-app-black);

        .slider {
            transform: translateX(var(--size));
        }
    }

</style>