<script lang="ts">
    type Props = {
        text?: string;
        icon?: string;
    };
    const { text, icon } = $props();
</script>

<li class="container">
    <div class="tip">
        <span class="tip-text"></span>
        <span class="tip-subtext"></span>
    </div>
    <button class="button">
        {#if text}
            <span>{text}</span>
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
    }

    .button {
        flex: 1;
        border: none;
        background: var(--color-app-black);
        color: var(--color-app-gray-alt-2);
        /*padding-block: 18px;*/
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        /*transition: color background-color 0.2s;*/
        
        &:hover {
            background: #222;
            color: var(--color-app-white);
        }
    }
    
    .icon{
        font-weight: 400;
        font-size: 1.5rem;
    }
</style>
