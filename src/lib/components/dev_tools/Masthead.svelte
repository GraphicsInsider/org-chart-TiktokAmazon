<script>
	import logo from '$lib/svg/logo.svg?raw';
</script>

<div
	class="fixed-top bg-white text-dark d-flex justify-content-center align-items-center headline-bold overflow-hidden"
	style="height:var(--mastheadHeight);font-size:1.25rem;box-shadow: 0 1px 0 0 #d4d8d9; z-index: 9999; background: white;"
>
	{@html logo}
</div>

<!-- mimics the sticky detection space -->
<div style="height:var(--mastheadHeight);" />

<style>
	.fixed-top :global(svg) {
		width: 410px;
		height: auto;
		padding-left: calc(50% - 539.5px);
		padding-right: calc(50% - 539.5px);

	}
	.fixed-top :global(svg *) {
		fill: var(--dark);
	}
</style>
