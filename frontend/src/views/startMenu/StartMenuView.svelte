<script lang="ts">
    import StartMenuOptions from "$/views/startMenu/components/StartMenuOptions.svelte";

</script>


<div class="start-menu">
   <div class="start-menu-contents" >
       <div class="app-logo">
           <h1 class="app-name">BOOLD</h1>
               <span class="version">v0.0.1</span>
       </div>
       <StartMenuOptions/>
   </div> 
</div>

<style>
    .start-menu{
        display: grid;
        place-items: center;
        background: var(--color-app-black);
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .start-menu-contents{
        display: flex;
        flex-direction: column;
        place-content: center;
        width: 100%;
        transition: transform 0.5s ease-in-out;
    }
    
    .app-logo{
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-block-end: 40px;
    }
    
    .app-name {
        font-family: var(--font-righteous);
        color: var(--color-app-white);
        font-weight: normal;
        font-size: 10rem;
        line-height: 0.8;
    }
    
    .version{
        font-family: var(--font-ubuntu);
        font-size: 1.125rem;
        color: var(--color-app-white);
    }
</style>