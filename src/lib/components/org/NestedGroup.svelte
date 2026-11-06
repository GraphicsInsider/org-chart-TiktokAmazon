<script>
	import Index from './Index.svelte';

	export let children = [];
	export let siblingNodes = [];
	export let showChildren = false;
	export let isInsideSelectedBranch = false;
	export let isInsideExpandedBranch = false;
	export let className = 'nested-group';
	export let allDisabled = false;
	export let hierarchyLevel = 2;
</script>

{#if showChildren && children?.length}
	<div
		class={className}
		class:all-disabled={allDisabled}
		class:two-columns={hierarchyLevel === 3}
	>
		{#each children as child (child.name)}
			<Index
				person={child}
				{isInsideSelectedBranch}
				{isInsideExpandedBranch}
				{siblingNodes}
				hierarchyLevel={hierarchyLevel}
			/>
		{/each}
	</div>
{/if}

<style>
	.nested-group {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		row-gap: 1rem;
		margin-top: -16px;
		border-left: 2px solid var(--bi-black);
		border-bottom: 2px solid var(--bi-black);
		height: fit-content;
		position: relative;
		padding: 2rem 0rem 1rem 1rem;
		border-radius: 0 0 0 8px;
		color: var(--bi-black);
	}

	.nested-group.all-disabled {
		border-color: var(--bi-gray-4);
	}

	.nested-group--right {
		border-left: none;
		border-right: 2px solid var(--bi-black);
		border-radius: 0 0 8px 0;
		padding-right: 1rem;
		direction: rtl;
	}

	@container (min-width: 516px) {
		.nested-group {
			grid-template-columns: repeat(1, minmax(0, 1fr));
			gap: 1rem;
			padding-right: 0.5rem;
		}

		.nested-group.two-columns {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@container (min-width: 900px) {
		.nested-group {
			grid-template-columns: repeat(1, minmax(0, 1fr));
			padding-right: 1rem;
		}

		.nested-group.two-columns {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
