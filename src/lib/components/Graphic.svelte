<script>
	import logo from '$lib/svg/logo.svg?raw';
	export let hed;
	export let dek;
	export let legend;
	export let note;
	export let source;
	export let byline;
</script>

<div class="figure-wrapper">
	<figure>
		{#if hed || dek || legend}
			<figcaption class="hed">{hed}</figcaption>
			{#if dek}<p class="dek">{dek}</p>{/if}
			{#if legend}
				<ul class="list-unstyled d-block w-100 p-0 my-3 text-left">
					{#each legend as key}
						<li class="d-inline-flex justify-content-center align-items-left align-middle">
							<span class="dot d-inline align-middle" style="background-color: {key.color};"
								>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
							>
							<span class="legend-label d-inline align-middle">{key.text}</span>
						</li>
					{/each}
				</ul>
			{/if}
		{/if}

		<slot />

		{#if note || source || byline}
			<div class="gfxfooter mx-0 mt-2">
				{#if note}
					<span class="note-inline">
						Note: {note}
						{#if source}
							<span class="separator" aria-hidden="true">•</span>
							<span class="source-inline">Source: {source}</span>
						{/if}
					</span>
				{:else if source}
					<span class="source d-block">Source: {source}</span>
				{/if}
				{#if byline}<span class="byline d-block">{byline}/BI</span>{/if}
			</div>
		{/if}
	</figure>
</div>

<style>
	.figure-wrapper {
		container-type: inline-size;
	}

	.hed {
		font-family: Garnett, arial, sans-serif;
		font-weight: 500;
		font-size: 22px;
		line-height: 24px;
		margin-bottom: 0.5rem;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
		display: block;
		word-wrap: break-word;
		overflow-wrap: break-word;
		text-align: left;
	}
	.dek {
		font-family: Garnett, arial, sans-serif;
		font-weight: 400;
		margin-bottom: 1rem;
		color: var(--bi-gray-1);
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
		text-align: left;
	}
	/* Fallback for browsers without container queries */
	@media (min-width: 600px) {
		.hed {
			font-size: 28px !important;
			line-height: 34px !important;
		}
		.dek {
			font-size: 18px !important;
			line-height: 22px !important;
		}
	}
	.legend-label {
		font-family: Garnett, arial, sans-serif;
		font-weight: 300;
		font-size: 12px;
		line-height: 13px;
	}

	.note-inline,
	.source-inline,
	.separator,
	.source,
	.byline {
		font-family: Garnett, arial, sans-serif;
		font-weight: 400;
		font-size: 11px;
		line-height: 13px;
		color: var(--bi-gray-1);
		box-sizing: border-box;
	}
	.note-inline,
	.source-inline {
		display: inline;
	}
	.separator {
		display: inline;
		margin: 0 0.2rem;
	}

	figure {
		width: 100%;
		min-width: 300px;
		max-width: 930px;
		box-sizing: border-box;
		margin: 0 auto;
	}

	.byline {
		margin-top: 0.25rem;
	}
	.source {
		margin-top: 0.125rem;
	}
	li .dot {
		width: 1rem;
		height: 1rem;
		display: inline-block;
	}
	.gfxfooter {
		text-align: left;
	}
	.gfxfooter:after {
		background-color: var(--bi-white) !important;
	}
	.d-inline-flex {
		display: inline !important;
	}
	figure :global(svg) {
		vertical-align: initial;
	}
	.list-unstyled {
		list-style: none;
	}
	.align-middle {
		vertical-align: middle;
	}
</style>
