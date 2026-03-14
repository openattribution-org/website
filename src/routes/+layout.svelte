<script lang="ts">
	import '../app.css';
	import { setAuthToken } from '$lib/api/client.js';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: { sessionToken: string | null }; children: Snippet } = $props();

	$effect(() => {
		setAuthToken(data.sessionToken);
	});
</script>

<svelte:head>
	<title>OpenAttribution</title>
</svelte:head>

{@render children()}
