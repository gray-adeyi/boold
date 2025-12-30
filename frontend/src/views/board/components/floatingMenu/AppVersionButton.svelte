<script lang="ts">
import { Portal } from "@jsrob/svelte-portal";
import AboutAppDialog from "$/views/board/components/floatingMenu/AboutAppDialog.svelte";
import FloatingMenuButton from "$/views/board/components/floatingMenu/FloatingMenuButton.svelte";

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
