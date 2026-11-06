<script>
	import Card from '$lib/components/org/Card.svelte';
	import NestedGroup from '$lib/components/org/NestedGroup.svelte';
	import { tick } from 'svelte';
	import {
		rootsSolo,
		rootsWithChildren,
		dualReportingPeople,
		dualReportingNames,
		expandedNodes,
		selectedNode,
		toggleNode,
		selectNode,
		hasSelectedDescendant,
		getAllDescendants,
		resetOrgChart
	} from '$lib/svelte-stores.js';

	export let person = null;
	export let isInsideSelectedBranch = false;
	export let isInsideExpandedBranch = false;
	export let siblingNodes = [];
	export let hierarchyLevel = 1;

	$: checkDisabled = (
		node,
		inSelectedBranch,
		inExpandedBranch,
		siblings = [],
		skipDisable = false
	) => {
		if (skipDisable) return false;
		if ($expandedNodes.size === 0) return false;
		if ($selectedNode === node.name) return false;
		if (!$selectedNode) return !inExpandedBranch;

		const hasSiblingSelected = siblings?.some((sib) => sib.name === $selectedNode);
		if (hasSiblingSelected) return true;
		return !inSelectedBranch && !hasSelectedDescendant(node, $selectedNode);
	};

	$: hasExpandedDesc = (node) => getAllDescendants(node).some((name) => $expandedNodes.has(name));
	$: isInExpandedBranch = (node, ancestorExpanded = false) =>
		ancestorExpanded || $expandedNodes.has(node.name) || hasExpandedDesc(node);
	$: areAllDisabled = (nodes = [], inSelectedBranch, ancestorExpanded = false, siblings = nodes) =>
		nodes.every((node) =>
			checkDisabled(node, inSelectedBranch, isInExpandedBranch(node, ancestorExpanded), siblings)
		);

	$: activeRootIndex = rootsWithChildren.findIndex((root) =>
		(root.children || [])
			.filter((child) => !dualReportingNames.has(child.name))
			.some((child) => $expandedNodes.has(child.name))
	);

	// Track the last scrolled selected node
	let lastScrolled = null;

	const escapeSelector = (value) => {
		if (typeof window === 'undefined') return value;
		return window.CSS?.escape ? window.CSS.escape(value) : value.replace(/"/g, '\\"');
	};

	const scrollSelectedIntoView = async (selectedName) => {
		if (typeof window === 'undefined') return;
		await tick();
		requestAnimationFrame(() => {
			const selector = `[data-node-name="${escapeSelector(selectedName)}"]`;
			const el = document.querySelector(selector);
			if (!el) return;
			el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
			lastScrolled = selectedName;
		});
	};

	$: if ($selectedNode && $selectedNode !== lastScrolled) {
		scrollSelectedIntoView($selectedNode);
	}
	$: if (!$selectedNode) {
		lastScrolled = null;
	}
</script>

<section class="position-relative d-flex flex-column">
	{#if !person}
		<!-- One CEO root -->
		{#if rootsSolo.length}
			<div class="root-group root-group--solo w-100 mb-3 align-self-center">
				{#each rootsSolo as topPerson (topPerson.name)}
					{@const hasExpandedDesc = getAllDescendants(topPerson).some((name) =>
						$expandedNodes.has(name)
					)}
					<Card
						orgData={topPerson}
						isExpanded
						isDisabled={checkDisabled(topPerson, false, hasExpandedDesc, [], true)}
						onSelect={resetOrgChart}
					/>
				{/each}
			</div>
		{/if}
		<!-- Multiple CEO roots -->
		<div class="root-group z-1">
			{#each rootsWithChildren as topPerson, i (topPerson.name)}
				{@const hasExpandedDesc = getAllDescendants(topPerson).some((name) =>
					$expandedNodes.has(name)
				)}
				{@const inExpandedBranch = isInExpandedBranch(topPerson)}
				{@const visibleChildren = topPerson.children.filter((c) => !dualReportingNames.has(c.name))}
				{@const allTopChildrenDisabled = areAllDisabled(
					visibleChildren,
					false,
					$expandedNodes.has(topPerson.name),
					topPerson.children
				)}

				{#if rootsWithChildren.length === 1}
					<Card
						orgData={topPerson}
						isExpanded
						isDisabled={checkDisabled(topPerson, false, hasExpandedDesc)}
						isTopPerson={true}
						onSelect={resetOrgChart}
					/>
				{:else}
					<Card
						orgData={topPerson}
						hasChildren={topPerson.children?.length > 0}
						isExpanded={$expandedNodes.has(topPerson.name) || hasExpandedDesc}
						isSelected={$selectedNode === topPerson.name}
						isDisabled={checkDisabled(topPerson, false, inExpandedBranch, rootsWithChildren)}
						isRightGroup={i === 1}
						isTopPerson={true}
						hasSelectedDescendant={hasExpandedDesc}
						onToggle={() => toggleNode(topPerson.name, topPerson, rootsWithChildren)}
						onSelect={topPerson.children?.length
							? () => selectNode(topPerson.name, hasExpandedDesc)
							: null}
					/>
				{/if}
			{/each}
		</div>
		<!-- Person report to a CEO -->
		<div class="root-group root-group--children" class:single-root={rootsWithChildren.length === 1}>
			{#each rootsWithChildren as topPerson, i (topPerson.name)}
				{@const isExpandedAncestor = isInsideExpandedBranch || $expandedNodes.has(topPerson.name)}
				{@const visibleChildren = topPerson.children.filter((c) => !dualReportingNames.has(c.name))}
				{@const allTopChildrenDisabled = areAllDisabled(
					visibleChildren,
					false,
					$expandedNodes.has(topPerson.name),
					topPerson.children
				)}

				<NestedGroup
					children={visibleChildren}
					siblingNodes={topPerson.children}
					showChildren={rootsWithChildren.length === 1 || $expandedNodes.has(topPerson.name)}
					hierarchyLevel={2}
					isInsideSelectedBranch={isInsideSelectedBranch || $selectedNode === topPerson.name}
					isInsideExpandedBranch={isExpandedAncestor}
					allDisabled={$expandedNodes.has(topPerson.name) ? false : allTopChildrenDisabled}
					className={i === 1 ? 'nested-group nested-group--right' : 'nested-group'}
				/>
			{/each}
		</div>
		<!-- Person report to multiple CEOs -->
		{#if dualReportingPeople.length}
			<div class="nested-group--double position-relative">
				{#each dualReportingPeople as dual (dual.name)}
					{@const hasDesc = hasSelectedDescendant(dual, $selectedNode)}
					{@const inExpandedBranch = isInExpandedBranch(dual, isInsideExpandedBranch)}
					{@const isExpandedAncestor = isInsideExpandedBranch || $expandedNodes.has(dual.name)}
					{@const allDualChildrenDisabled = areAllDisabled(
						dual.children,
						$selectedNode === dual.name || hasDesc,
						isExpandedAncestor,
						dual.children
					)}

					<div>
						<Card
							orgData={dual}
							hasChildren={dual.children?.length > 0}
							isExpanded={$expandedNodes.has(dual.name) || hasDesc}
							isSelected={$selectedNode === dual.name}
							isDisabled={checkDisabled(
								dual,
								isInsideSelectedBranch,
								inExpandedBranch,
								dualReportingPeople
							)}
							hasSelectedDescendant={hasDesc}
							onToggle={() =>
								toggleNode(dual.name, dual, dualReportingPeople, { collapseRootTrees: true })}
							onSelect={dual.children?.length ? () => selectNode(dual.name, hasDesc) : null}
						/>
						<NestedGroup
							children={dual.children}
							siblingNodes={dual.children}
							showChildren={$expandedNodes.has(dual.name)}
							hierarchyLevel={3}
							isInsideSelectedBranch={$selectedNode === dual.name || hasDesc}
							isInsideExpandedBranch={isExpandedAncestor}
							allDisabled={allDualChildrenDisabled}
						/>
					</div>
				{/each}
			</div>
		{/if}
	{:else}
	<!-- Person node -->
		{@const hasDesc = hasSelectedDescendant(person, $selectedNode)}
		{@const inExpandedBranch = isInExpandedBranch(person, isInsideExpandedBranch)}
		{@const isExpandedAncestor = isInsideExpandedBranch || $expandedNodes.has(person.name)}
		{@const allPersonChildrenDisabled = areAllDisabled(
			person.children,
			isInsideSelectedBranch || $selectedNode === person.name,
			isExpandedAncestor,
			person.children
		)}
		<Card
			orgData={person}
			hasChildren={person.children?.length > 0}
			isExpanded={$expandedNodes.has(person.name) || hasDesc}
			isSelected={$selectedNode === person.name}
			isDisabled={checkDisabled(person, isInsideSelectedBranch, inExpandedBranch, siblingNodes)}
			hasSelectedDescendant={hasDesc}
			onToggle={() => toggleNode(person.name, person, siblingNodes)}
			onSelect={person.children?.length ? () => selectNode(person.name, hasDesc) : null}
		/>
		<NestedGroup
			children={person.children}
			siblingNodes={person.children}
			showChildren={$expandedNodes.has(person.name)}
			hierarchyLevel={hierarchyLevel + 1}
			isInsideSelectedBranch={isInsideSelectedBranch || $selectedNode === person.name}
			isInsideExpandedBranch={isExpandedAncestor}
			allDisabled={allPersonChildrenDisabled}
		/>
	{/if}

	{#if !person && $expandedNodes.size > 0}
		<button
			class="btn sticky-bottom ms-auto shadow-sm"
			style="bottom: 0.5rem; right: 0.5rem; color: var(--bi-white); background-color: var(--bi-gray-neutral-900);"
			on:click={resetOrgChart}
		>
			Reset
		</button>
	{/if}
</section>

<style>
	.root-group {
		display: grid;
		gap: 1rem;
		grid-auto-rows: max-content;
		grid-auto-flow: column;
		grid-auto-columns: minmax(0, 1fr);
		align-items: stretch;
	}

	.root-group--children {
		gap: 0;
		grid-template-columns: 1fr;
		grid-auto-flow: row;
	}

	.nested-group--double {
		padding: 1.5rem 1rem 1.5rem 1rem;
		border-left: 2px solid var(--bi-black);
		border-right: 2px solid var(--bi-black);
		border-bottom: 2px solid var(--bi-black);
		border-radius: 0 0 8px 8px;
		margin-top: -8px;
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-rows: max-content;
		column-gap: 1rem;
		row-gap: 1.5rem;
	}

	@container (min-width: 516px) {
		.nested-group--double {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.root-group--solo {
			max-width: 50%;
		}

		.root-group--children {
			grid-auto-flow: column;
			grid-auto-columns: minmax(0, 1fr);
		}

	}

	@container (min-width: 900px) {
		.nested-group--double {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

	}
</style>
