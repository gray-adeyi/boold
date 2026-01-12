<script lang="ts">
</script>

<div class="container">
    {#if false}
        <h3>Wire</h3>
        <p>From: x,y</p>
        <p>To: x1,y1</p>
        <p>Value: 1</p>
    {:else }
        <h3>AND Gate Component</h3>
        <p>x,y</p>
        <p title="9a2001c7-b41a-482f-9e3b-e1848a2a4cf2">ID: 9a2001c7-b41a-482f-9e3b-e1848a2a4cf2</p>
        <p>Placed by: You</p>
        <p>Value: 1</p>
    {/if}
</div>


<style>
    .container {
        left: 200px;
        top: 100px;
        position: fixed;
        background: var(--color-app-black);
        color: var(--color-app-gray);
        font-size: 0.875rem;
        padding: 0.5rem;
        box-shadow: 0 0 20px rgba(0 0 0 / .25);
        border-radius: 5px;
        text-align: center;
        line-height: 1rem;
        overflow: hidden;
        white-space: nowrap;
    }
</style>