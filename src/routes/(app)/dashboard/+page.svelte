<script lang="ts">
	import { getTheme } from '$lib/stores/theme.svelte.js';
	import { Globe, BarChart3, Key } from 'lucide-svelte';

	const theme = $derived(getTheme());
</script>

<svelte:head>
	<title>Dashboard - {theme.name}</title>
</svelte:head>

<div class="py-8">
	<h1 class="text-2xl lg:text-3xl mb-2">Dashboard</h1>
	<p class="text-gray-600 font-light mb-8">Welcome to {theme.name}</p>

	<div class="grid md:grid-cols-3 gap-6">
		<a href="/domains" class="bg-white rounded-2xl shadow-lg border border-brand-100 p-8 hover:shadow-xl transition group">
			<Globe size={24} class="text-brand-600 mb-4" />
			<h3 class="text-lg mb-1 group-hover:text-brand-600 transition">Domains</h3>
			<p class="text-gray-600 font-light text-sm">Register and verify your domains</p>
		</a>
		<div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 opacity-60">
			<BarChart3 size={24} class="text-gray-400 mb-4" />
			<h3 class="text-lg mb-1">Telemetry</h3>
			<p class="text-gray-500 font-light text-sm">Coming soon</p>
		</div>
		<div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 opacity-60">
			<Key size={24} class="text-gray-400 mb-4" />
			<h3 class="text-lg mb-1">API keys</h3>
			<p class="text-gray-500 font-light text-sm">Coming soon</p>
		</div>
	</div>
</div>
