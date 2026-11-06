<script>
	import { handleCardClick } from '$lib/svelte-stores.js';

	export let orgData;
	export let onToggle = null;
	export let onSelect = null;
	export let hasChildren = false;
	export let isExpanded = false;
	export let isSelected = false;
	export let isDisabled = false;
	export let isRightGroup = false;
	export let hasSelectedDescendant = false;
	export let isTopPerson = false;

	$: optionalFields = [orgData.field1, orgData.field2, orgData.field3]
		.map((field) => field?.trim())
		.filter(Boolean);
	$: isInteractive = hasChildren || onSelect;

	const triggerClick = () => {
		if (isInteractive) {
			handleCardClick(isExpanded, hasSelectedDescendant, hasChildren, onSelect, onToggle);
		}
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="card-wrapper"
	data-node-name={orgData.name}
	class:has-children={hasChildren}
	class:expanded={isExpanded || isTopPerson}
	class:selected={isSelected && isExpanded}
	class:disabled={isDisabled}
	class:top-person={isTopPerson}
	on:click|stopPropagation={triggerClick}
	role="button"
	tabindex={isInteractive ? 0 : -1}
	style:margin-bottom={hasChildren ? '0.5rem' : '0'}
	style:cursor={isInteractive ? 'pointer' : 'default'}
>
	<p class="gi-medium mb-2">{orgData.title}</p>

	<div class="card-content d-flex justify-content-between border-top pt-2">
		<div class="card-info d-flex flex-column flex-grow-1 overflow-hidden">
			{orgData.name}
			{#each optionalFields as field}
				<p class="m-0">{field}</p>
			{/each}
		</div>

		{#if orgData.imgID}
			<img
				src="https://i.insider.com/{orgData.imgID}?width=400&format=jpeg&auto=webp&crop=1:1,smart"
				width="56"
				height="56"
				loading="lazy"
				alt="portrait of {orgData.name}"
				class="rounded-circle mt-2 flex-shrink-0"
			/>
		{/if}
	</div>

	{#if hasChildren}
		<button
			class="expand-button position-absolute border-0 d-flex align-items-center justify-content-center cursor-pointer z-1"
			class:expanded={isExpanded || (isTopPerson && !isDisabled)}
			class:right-group={isRightGroup}
			type="button"
			on:click|stopPropagation={triggerClick}
		>
			<svg width="14" height="14" viewBox="0 0 14 14" fill="none" class:rotate={isExpanded}>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M11.34 3.20825L6.97351 7.71148L2.66016 3.26305L1.16675 4.80323L6.97326 10.7916L12.8334 4.74844L11.34 3.20825Z"
					fill="currentColor"
				/>
			</svg>
		</button>
	{/if}
</div>

<style>
	.rotate {
		transform: rotate(180deg);
	}
	.card-wrapper {
		position: relative;
		border: 2px solid var(--bi-gray-2);
		padding: 0.8rem;
		border-radius: 8px;
		font-size: 14px;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background-color: var(--bi-white);
		color: var(--bi-black);
		container-type: inline-size;
		scroll-margin-top: 88px;
	}

	.card-wrapper.has-children.expanded.top-person {
		height: 100%;
	}

	.card-wrapper.has-children > .card-content > .card-info {
		padding-bottom: 0.8rem;
	}

	.card-wrapper.has-children:hover {
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
		background-color: var(--bi-warmgray-2);
	}

	.card-wrapper.expanded {
		border: 2px solid var(--bi-black);
		background-color: var(--bi-white);
		height: fit-content;
	}

	.card-wrapper.selected {
		border: 2px solid var(--bi-black);
		background-color: var(--bi-warmgray-2);
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
	}

	.card-wrapper.disabled {
		border: none;
		background-color: var(--bi-gray-2);
		border: 2px solid var(--bi-gray-2);
		opacity: 0.2;
		height: fit-content;
	}

	.expand-button {
		left: -2px;
		bottom: -1rem;
		border-radius: 0 50% 50% 0;
		height: 2rem;
		width: 2rem;
		padding-left: 0;
		padding-right: 0.2rem;
		background-color: var(--bi-gray-2);
		color: var(--bi-black);
	}

	.expand-button.right-group {
		left: auto;
		right: -2px;
		padding-right: 0;
		padding-left: 0.2rem;
		border-radius: 50% 0 0 50%;
	}

	.expand-button.expanded {
		background-color: var(--bi-black);
		color: var(--bi-white);
	}

	svg {
		transition: transform 0.3s ease;
		transform-origin: center;
	}

	@container (max-width: 180px) {
		.card-content {
			flex-direction: column;
		}
	}
</style>
