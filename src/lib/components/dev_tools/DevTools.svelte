<script>
	import SiteStyles from './SiteStyles.svelte';
	import Masthead from './Masthead.svelte';
</script>

{#if import.meta.env.DEV}
	<SiteStyles />
	<Masthead />
{/if}
