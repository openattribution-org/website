<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<Nav />
<main class="pt-20 pb-12">
	<div class="max-w-5xl mx-auto px-6">
		{@render children()}
	</div>
</main>
