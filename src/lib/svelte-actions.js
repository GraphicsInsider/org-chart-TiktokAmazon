/**
 * @module svelte-actions
 * @exports inView
 * @description file that contains useful svelte actions.
 * @see {@link https://svelte.dev/docs#template-syntax-element-directives-use-action} for action documentation
 */

/**
 * @deprecated
 * @sync
 * @function inView
 * @param {node} node - dom node to watch
 * @param {object} params - optional configuration object for observer taking root, top, and bottom. top and bottom are numbers
 * @description runs a callback function when element enters and exits the page
 * @example
 * * <p use:inView={bottom: 100}
 * *		on:enter={() => console.log("enter")}
 * *    on:exit={() => console.log("exit")}
 * * >
 * * 		Lorem Ipsum
 * * </p>
 * @see {@link https://github.com/maciekgrzybek/svelte-inview} if you need this functionality for your project
 */

 const inView = (node, params = {}) => {
	let observer;

	const handleIntersect = (e) => {
		const v = e[0].isIntersecting ? 'enter' : 'exit';
		node.dispatchEvent(new CustomEvent(v));
	};

	const setObserver = ({ root, top, bottom }) => {
		const marginTop = top ? top * -1 : 0;
		const marginBottom = bottom ? bottom * -1 : 0;
		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
		const options = { root, rootMargin };
		if (observer) observer.disconnect();
		observer = new IntersectionObserver(handleIntersect, options);
		observer.observe(node);
	};

	setObserver(params);

	return {
		update(params) {
			setObserver(params);
		},

		destroy() {
			if (observer) observer.disconnect();
		}
	};
};

export { inView };
