/**
 * Adds a unique query parameter to the production JavaScript and stylesheet URLs.
 *
 * The assets intentionally retain stable filenames so an embed does not need to
 * change its paths. The query string gives each published embed a new URL, which
 * prevents an editor or browser from reusing a cached bundle.
 */
import { readFile, writeFile } from 'node:fs/promises';

const outputPath = new URL('../build/index.html', import.meta.url);
const version = Date.now().toString();
const html = await readFile(outputPath, 'utf8');

const versionedHtml = html.replace(
	/(\b(?:src|href)="[^"]+\/(?:index\.js|index\.css))(")/g,
	`$1?v=${version}$2`
);

if (versionedHtml === html) {
	throw new Error('Could not find the production JavaScript or stylesheet URLs to version.');
}

await writeFile(outputPath, versionedHtml);
console.log(`Added cache-busting version ${version} to build/index.html`);
