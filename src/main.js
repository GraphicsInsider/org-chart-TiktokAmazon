import '$lib/styles/app.css';
import '$lib/styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// viz components
import OrgChart from './OrgchartWrapper.svelte';

const urlParams = new URLSearchParams(window.location.search);

function getThemeMode() {
	if (urlParams.get('dark-mode') === '1') {
		return 'dark';
	}
	return 'light';
}

function applyThemeMode() {
	const themeMode = getThemeMode();
	document.documentElement.dataset.theme = themeMode;
	document.documentElement.style.colorScheme = themeMode;
}

applyThemeMode();

const components = [
	{
		chartID: 'orgchart',
		Component: OrgChart
	}
];

function mountComponent({
	Component,
	id,
	selector = `#svelte-${id}`,
	target = document.querySelector(selector),
	props: clientProps = {},
	...svelteOptions
}) {
	if (!Component) {
		console.trace('Missing required parameter: Component');
		return null;
	}
	if (!target) {
		console.trace('⚠️ No element found for svelte component:', selector);
		return null;
	}
	const props = {
		...clientProps
		// ...inlineProps,
	};
	return new Component({
		target,
		props,
		...svelteOptions
	});
}

components.forEach((comp) => {
	const { chartID, Component } = comp;
	const target = document.querySelector(`figure[data-chart="${chartID}"]`);
	if (target) {
		// Remove any injected style tags that affect figures (optional, for robustness)
		const injectedStyles = document.querySelectorAll('style');
		injectedStyles.forEach((styleTag) => {
			if (
				styleTag.textContent.includes('figure') &&
				styleTag.textContent.includes('margin-block-start')
			) {
				styleTag.remove();
			}
		});

		// Apply margin reset styles directly to the figure[data-chart] element
		target.style.setProperty('margin-block-start', 'auto', 'important');
		target.style.setProperty('margin-block-end', 'auto', 'important');
		target.style.setProperty('margin-inline-start', 'auto', 'important');
		target.style.setProperty('margin-inline-end', 'auto', 'important');

		mountComponent({
			Component,
			target,
			props: {}
		});
	}
});
