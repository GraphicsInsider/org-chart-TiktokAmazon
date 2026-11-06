/**
 * @async
 * @function init
 * @function requestAndParse
 *  * @param {object} opt - Object containing google doc properties from meta.json
 *  * @param {function} cb - Callback function passed by init function that loops through array if more than one google doc
 * @requires fs
 * @requires archieml
 * @requires node-fetch
 * @requires htmlparser2
 * @requires html-entities
 * @description Writes ArchieML formatted google doc to src/lib/data as json file.
 * 	*	Requires that your google doc is viewable by anyone on the internet.
 * 	*	Add google doc ID and filepath you want to meta.json file
 * 	*	Then type npm run gdoc in your cli and hit return
 * @see {@link https://nodejs.org/docs/latest-v16.x/api/fs.html} for fs documentation 
 * @see {@link http://archieml.org/} for ArchieML documentation
 * @see {@link https://github.com/node-fetch/node-fetch} for node-fetch documentation
 * @see {@link https://github.com/fb55/htmlparser2#readme} for htmlparser2 documentation
 * @see {@link https://github.com/mdevils/html-entities#readme} for html-entities documentation
 */

import fs from 'fs';
import archieml from 'archieml';
import fetch from 'node-fetch';
import * as htmlparser from 'htmlparser2';
import { decode } from 'html-entities';

const CWD = process.cwd();
const CONFIG_PATH = `${CWD}/src/lib/data/meta.json`;
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const { doc } = CONFIG.google;

async function requestAndParse(opt, cb) {
	try {
		const response = await fetch(`https://docs.google.com/document/d/${opt.id}/export?format=html`);
		if (response.ok) {
			const body = await response.text();
			let parsed;
			const parser = new htmlparser.Parser(
				new htmlparser.DomHandler(function (error, dom) {
					if (error) throw error;
					else {
						const tagHandlers = {
							_base: function (tag) {
								let str = '';
								tag.children.forEach(function (child) {
									let func = tagHandlers[child.name || child.type];
									if (func) str += func(child);
								});
								return str;
							},
							text: function (textTag) {
								return textTag.data;
							},
							span: function (spanTag) {
								return tagHandlers._base(spanTag);
							},
							p: function (pTag) {
								return tagHandlers._base(pTag) + '\n';
							},
							a: function (aTag) {
								let href = aTag.attribs.href;
								if (href === undefined) return '';
								if (
									href &&
									href.includes('://www.') &&
									new URL(href) &&
									new URL(href).searchParams.get('q')
								) {
									href = new URL(href).searchParams.get('q');
								}
								return `<a href="${href}">${tagHandlers._base(aTag)}</a>`;
							},
							li: function (tag) {
								return '* ' + tagHandlers._base(tag) + '\n';
							},
							b: function (bTag) {
								return `<b>${tagHandlers._base(bTag)}</b>`;
							}
						};
						['ul', 'ol'].forEach(function (tag) {
							tagHandlers[tag] = tagHandlers.span;
						});
						['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function (tag) {
							tagHandlers[tag] = tagHandlers.p;
						});
						const body = dom[0].children[1];
						let parsedText = tagHandlers._base(body);
						// Convert html entities into the characters as they exist in the google doc
						parsedText = decode(parsedText);
						// Remove smart quotes from inside tags
						parsedText = parsedText.replace(/<[^<>]*>/g, function (match) {
							return match.replace(/"|"/g, '"').replace(/'|'/g, "'");
						});
						parsed = JSON.stringify(archieml.load(parsedText), null, 2);
					}
				})
			);
			parser.write(body);
			parser.done();
			const file = `${CWD}/${opt.filepath || 'src/data/copy.json'}`;
			fs.writeFile(file, parsed, (err) => {
				if (err) throw err;
				console.log(
					'archie doc with id',
					'\x1b[32m',
					`${opt.id}`,
					'\x1b[0m',
					'successfully written to',
					'\x1b[34m',
					`${file}\n`
				);
				cb();
			});
		}
	} catch (err) {
		console.error(err);
	}
}

function init() {
	let i = 0;
	const next = () => {
		const d = doc[i];
		if (d.id)
			requestAndParse(d, () => {
				i += 1;
				if (i < doc.length) next();
				else process.exit();
			});
	};
	next();
}
init();