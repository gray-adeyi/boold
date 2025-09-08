import { mount } from 'svelte'
// Fonts
import '@fontsource/material-icons';
import '@fontsource/righteous';
import '@fontsource-variable/inconsolata';
import '@fontsource/ubuntu';
import '@fontsource/ubuntu-mono';
import '@fontsource/monaspace-neon';
import './app.css'
import App from '$/App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
