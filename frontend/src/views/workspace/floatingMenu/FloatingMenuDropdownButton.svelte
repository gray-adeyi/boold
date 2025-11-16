<script lang="ts">
    import FloatingMenuButton from "$/views/workspace/floatingMenu/FloatingMenuButton.svelte";

    type Props = {
      isDropdownVisible: boolean;
      onclick: () => void;
    }
    
    const {isDropdownVisible, onclick}: Props = $props()
    
    const materialIcon = $derived(isDropdownVisible ? "expand_more" : "expand_less")
</script>


<FloatingMenuButton {materialIcon} {onclick} />