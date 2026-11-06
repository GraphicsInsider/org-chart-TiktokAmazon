/**
 * @module svelte-stores
 * @requires svelte/store
 * @description file that contains any useful svelte stores for your project.
 * * if your project doesn't require stores, delete this file.
 * @see {@link https://svelte.dev/docs#run-time-svelte-store} for documentation
 */

import { readable, writable, get } from 'svelte/store';
import orgData from '$lib/data/orgData.csv';

/**
 * DATA PRE-PROCESSING
 */
const peopleMap = new Map(orgData.map((p) => [p.name, p]));

function buildHierarchy(parentName = 'Pseudo') {
	return orgData
		.filter((p) => p.reportTo === parentName || p.reportTo2 === parentName)
		.map((p) => ({
			...p,
			children: buildHierarchy(p.name)
		}));
}

export const hierarchy = buildHierarchy();

export const rootsSolo = hierarchy.filter((p) => !p.children?.length);
export const rootsWithChildren = hierarchy.filter((p) => p.children?.length);

// Keep the root, its direct reports, and their direct reports visible on load.
// Nodes below that third level remain collapsed until their card is expanded.
const defaultExpandedNodeNames = new Set();
rootsWithChildren.forEach((root) => {
	defaultExpandedNodeNames.add(root.name);
	(root.children || []).forEach((child) => defaultExpandedNodeNames.add(child.name));
});

const rootTreeNames = new Set();
rootsWithChildren.forEach((root) => {
	rootTreeNames.add(root.name);
	getAllDescendants(root).forEach((name) => rootTreeNames.add(name));
});

const rootNames = new Set([...rootsSolo, ...rootsWithChildren].map((p) => p.name));
   
export const dualReportingPeople = orgData
	.filter((p) => p.reportTo2 && rootNames.has(p.reportTo2))
	.map((p) => ({
		...p,
		children: buildHierarchy(p.name)
	}));

export const dualReportingNames = new Set(dualReportingPeople.map((p) => p.name));

/**
 * STATE STORES
 */
export const url = readable(import.meta.env.BASE_URL);
export const expandedNodes = writable(new Set(defaultExpandedNodeNames));
export const selectedNode = writable(null);

/**
 * LOGIC & ACTIONS
 */
export function getAllDescendants(node) {
	const descendants = [];
	const stack = [...(node.children || [])];
	while (stack.length > 0) {
		const curr = stack.pop();
		descendants.push(curr.name);
		if (curr.children) stack.push(...curr.children);
	}
	return descendants;
}

export function hasSelectedDescendant(node, selectedId) {
	if (!selectedId || !node.children?.length) return false;
	return getAllDescendants(node).includes(selectedId);
}

function getPrimaryRootName(personName) {
	let current = personName;
	const visited = new Set();
	while (current && current !== 'Pseudo' && !visited.has(current)) {
		visited.add(current);
		const node = peopleMap.get(current);
		if (!node) return null;
		const parent = node.reportTo;
		if (!parent || parent === 'Pseudo') return node.name;
		current = parent;
	}
	return null;
}

export function toggleNode(personName, node, siblingNodes = [], options = {}) {
	const currentSelected = get(selectedNode);

	expandedNodes.update((nodes) => {
		const next = new Set(nodes);

		if (next.has(personName)) {
			// Collapse logic
			next.delete(personName);
			const descendants = node ? getAllDescendants(node) : [];
			descendants.forEach((d) => next.delete(d));
			if (descendants.includes(currentSelected)) selectedNode.set(null);
		} else {
			// Expand logic
			// Auto-collapse siblings
			siblingNodes.forEach((sib) => {
				if (sib.name !== personName) {
					next.delete(sib.name);
					getAllDescendants(sib).forEach((d) => next.delete(d));
				}
			});
			// Auto-collapse entire root trees when expanding other root
			if (options.collapseRootTrees) {
				const protectedNodes = new Set([personName, ...getAllDescendants(node || { children: [] })]);
				[...next].forEach((expandedName) => {
					if (protectedNodes.has(expandedName)) return;
					if (!rootTreeNames.has(expandedName)) return;

					next.delete(expandedName);
					const expandedNode = peopleMap.get(expandedName);
					const descendants = getAllDescendants(expandedNode || { children: [] });
					descendants.forEach((d) => next.delete(d));
					if (currentSelected && (currentSelected === expandedName || descendants.includes(currentSelected))) {
						selectedNode.set(null);
					}
				});
			}

			// Auto-collapse expanded nodes from other root
			const targetRoot = getPrimaryRootName(personName);
			if (targetRoot) {
				[...next].forEach((expandedName) => {
					if (expandedName === personName) return;
					const expandedRoot = getPrimaryRootName(expandedName);
					if (expandedRoot && expandedRoot !== targetRoot) {
						next.delete(expandedName);
						const expandedNode = peopleMap.get(expandedName);
						getAllDescendants(expandedNode || { children: [] }).forEach((d) => next.delete(d));
					}
				});
			}

			next.add(personName);
		}
		return next;
	});
}

export function selectNode(personName, hasSelectedDesc = false) {
	if (hasSelectedDesc) {
		selectedNode.set(null);
		expandedNodes.update((n) => {
			n.delete(personName);
			return n;
		});
	} else {
		selectedNode.update((curr) => (curr === personName ? null : personName));
	}
}

export function handleCardClick(isExpanded, hasSelectedDesc, hasChildren, onSelect, onToggle) {
	if (isExpanded && hasSelectedDesc) {
		onToggle?.();
	} else {
		onSelect?.();
		if (hasChildren && !hasSelectedDesc) onToggle?.();
	}
}

export function resetOrgChart() {
	expandedNodes.set(new Set(defaultExpandedNodeNames));
	selectedNode.set(null);
}
