<script lang="ts">
import FloatingMenuButton from "$/views/board/floatingMenu/FloatingMenuButton.svelte";
import { Portal } from "@jsrob/svelte-portal";
import AboutAppDialog from "$/views/board/floatingMenu/AboutAppDialog.svelte";

let isAboutAppDialog = $state(false);
</script>

<FloatingMenuButton
    onclick={() => (isAboutAppDialog = true)}
    materialIcon="memory"
    text="BOOLD v0.0.1"
/>

<Portal target="#workspace-portal-target">
    {#if isAboutAppDialog}
        <AboutAppDialog onclose={() => (isAboutAppDialog = false)} />
    {/if}
</Portal>
