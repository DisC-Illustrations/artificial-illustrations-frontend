import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		hmr: {
			overlay: true
		},
	},
	build: {
		sourcemap: true,
	},
	logLevel: 'info',
	clearScreen: false
})
