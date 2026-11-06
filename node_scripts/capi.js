/**
 * @async
 * @function getCAPIData
 * @requires node-fetch
 * @requires fs
 * @description Writes CAPI return to JSON file.
 * 	*	Requires that you are signed into GlobalProtect VPN on your local machine.
 * 	*	Add Viking preview url in src/meta.json as CAPIurl
 * 	*	Pass api URL from meta.json as the argument to the fetch call assigned to the capi constant.
 * 	*	Then type npm run capi in your cli and hit return
 * {@link https://contentapi.businessinsider.com/} API documentation
 */

import fetch from "node-fetch"
import fs from "fs"

const CWD = process.cwd();
const CONFIG_PATH = `${CWD}/src/lib/data/meta.json`;
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const { CAPIurl } = CONFIG;

getCAPIData();

async function getCAPIData() {
	try {
		const capi = await fetch(CAPIurl);
		if (capi.ok) {
			const data = await capi.json();
			const dataFile = JSON.stringify(data, null, 2);

			fs.writeFile('./src/data/capi.json', dataFile, (err) => {
				if (err) {
					throw err;
				}
				console.log('\x1b[32m','CAPI data', '\x1b[0m', 'succesfully written to', '\x1b[34m', '/src/data/capi.json');
			});
		}
	} catch (error) {
		console.error(error);
	}
}