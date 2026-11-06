import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import * as path from 'path';
import dsv from '@rollup/plugin-dsv';
import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

// get current dir for linking assets to S3
const CWD = process.cwd();
const loc = CWD.split('/');
const dir = loc[loc.length - 1]; // current dir
const split = dir.split('-');
const s3link = `https://tbimedia.s3.us-east-1.amazonaws.com/bistudios/_00/dev_edit/graphics/${split[0]}/${split[1]}/${dir}/`;



// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const isProduction = mode === 'production';
	return {
		// assets should link to s3 on build
		base: isProduction ? s3link : '/',
		build: {
			// mimic svelte-template output
			outDir: 'build',

			// build without hashes in filenames
			// useful for not having to re-embed
			rollupOptions: {
				output: {
					entryFileNames: `[name].js`,
					chunkFileNames: `[name].js`,
					assetFileNames: `[name].[ext]`,
				},
			},
		},
		resolve: {
			alias: {
				// alias to find all dev files that live in /lib
				$lib: path.resolve('./src/lib'),
			},
		},
		plugins: [
			dsv(),
			svelte({
				preprocess: preprocess({
					postcss: { plugins: [autoprefixer()] },
				}),
			}),
		],
	};
});
