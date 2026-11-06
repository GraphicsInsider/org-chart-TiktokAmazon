/**
 * @module utils
 * @requires svelte/easing
 * @requires d3-interpolate
 * @exports move
 * @exports transformSvg
 * @description file that contains any useful javascript utilities.
 * @see {@link https://svelte.dev/docs#run-time-svelte-easing} for easing documentation
 * @see {@link https://github.com/d3/d3-interpolate} for d3 interpolate documentation
 */

import { linear } from 'svelte/easing';
import { interpolateTransformSvg } from 'd3-interpolate';

/**
 * @sync
 * @function move
 * @param {string || number} x - Amount of pixels to move horizontally
 * @param {string || number} y - Amount of pixels to move vertically
 * @description function that moves a dom element
 */

const move = (x, y) => {
	`transform: translate(${x}px, ${y}px)`;
}

/**
 * @sync
 * @function transformSvg
 * @param {node} node - SVG dom node to transform
 * @param {object} params - configuration object that controls animation 
 * @description interpolates transformation of one svg shape to another
 */

const transformSvg = (node, params) => {
	const a = node.getAttribute('transform');
	const b = `${params.relative ? a : ''} ${params.target}`;
	const interpolator = interpolateTransformSvg(a, b);

	return {
		delay: params.delay || 0,
		duration: params.duration || 250,
		easing: params.easing || linear,
		tick: (t, u) => {
			const transform = interpolator(u);
			node.setAttribute('transform', transform);
		},
		css: (t) => (params.opacity ? `opacity: ${t}` : null),
	};
}

/**
 * @sync
 * @function trackAudience
 * @param {'embed'|'custom_page'} eventCategory - the category to be sent to GA
 * @param {string} eventAction - a sensible descriptor of the user action performed on the ui element. on a button this would be 'click', on a checkbox 'checked' or 'unchecked', on a scrollybox 'scrolled_in_forwards' or 'scrolled_out_forwards', etc.  
 * @param {string} eventLabel - a sensible label for the element that was acted upon. Ex. If it's a select element full of states or countries you would put the state or country name here. If it's a play or pause button for a media player you would put "play" or "pause." Etc.
 * @description sends data to universal google analytics about specific interactions. you would import this function into your component and call it in your event handler after all the functional logic. we use underscores here for the string values only because that's the convention already established by product analytics.
 * @example 
 * <button type="button" on:click={() => {
 *		// your specific event related code
 *		trackAudience('embed', 'click', 'play') 		
 * }}>
 * 		play
 * </button>
 */

const trackAudience = (eventCategory, eventAction, eventLabel) => {
	if (window.dataLayer) {
		window.dataLayer.push({
			event: 'insider_graphics',
			eventCategory: eventCategory,
			eventAction: eventAction,
			eventLabel: eventLabel
		})
	}
}

export { move, transformSvg, trackAudience }