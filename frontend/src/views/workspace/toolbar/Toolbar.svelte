<script>
    import ToolbarItem from "$/views/workspace/toolbar/ToolbarItem.svelte";

</script>



<div class="container">
    <span class="toast">Selected And gate for me</span>
    <ul class="toolbar-items">
        <ToolbarItem text="I/O" />
        <ToolbarItem text="!" />
        <ToolbarItem text="&" />
        <ToolbarItem text="|" />
        <ToolbarItem text="^" />
        <ToolbarItem icon="memory" />
        <ToolbarItem icon="list" />
    </ul>
</div>


<style>
    .container{
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }
    
    .toast{
        display: block;
        position: absolute;
        color: var(--color-app-black);
        background: var(--color-app-white);
        font-size: 0.9375rem;
        border-radius: 50px;
        padding: 10px 25px;
        top: -50px;
        left: 50%;
        white-space: nowrap;
        transform: translateX(-50%);
    }
    
    .toolbar-items{
        display: flex;
        align-items: center;
        list-style-type: none;
        border-radius: 5px 5px 0 0;
        box-shadow: 0 0 20px rgba(0 0 0 / .5);
    }
</style>