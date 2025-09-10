import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import {resolve} from 'node:path'

import svelteSVG from "@hazycora/vite-plugin-svelte-svg";
// https://vite.dev/config/
export default defineConfig({
    plugins: [svelte(),
        svelteSVG({
            svgoConfig: {}, // See https://github.com/svg/svgo#configuration
            requireSuffix: true, // Set false to accept '.svg' without the '?component'
        }),
    ],
    resolve: {
        alias: {
            '$': resolve(__dirname, 'src'),
            '$backend': resolve(__dirname, 'wailsjs/go/main/App.js'),
            '$runtime': resolve(__dirname, 'wailsjs/runtime/runtime.js')
        }
    }
})
