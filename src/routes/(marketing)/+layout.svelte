<script lang="ts">
	import { page } from '$app/stores';
	import { Menu, X } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const user = $derived($page.data.user);
	let mobileOpen = $state(false);

	const navLinks = [
		{ href: '/policycheck', label: 'PolicyCheck' },
		{ href: '/blog', label: 'Blog' },
		{ href: '#developers', label: 'Developers' },
		{ href: '#contact', label: 'Get Involved' }
	];
</script>

<!-- Marketing Nav -->
<nav class="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-brand-100">
	<div class="max-w-7xl mx-auto px-6 py-4">
		<div class="flex items-center justify-between">
			<a href="/" class="text-2xl font-light tracking-tight">
				<span class="text-brand-600">Open</span><span class="text-gray-800">Attribution</span>
			</a>

			<!-- Desktop nav -->
			<div class="hidden md:flex items-center gap-8">
				{#each navLinks as link}
					<a href={link.href} class="text-gray-600 hover:text-brand-600 transition font-light">
						{link.label}
					</a>
				{/each}

				{#if user}
					<a href="/dashboard" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-normal text-sm">
						Dashboard
					</a>
				{:else}
					<a href="/login" class="text-gray-600 hover:text-brand-600 transition font-light">
						Sign in
					</a>
					<a href="/signup" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-normal text-sm">
						Get started
					</a>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<button
				onclick={() => (mobileOpen = !mobileOpen)}
				class="md:hidden text-gray-600 p-2"
				aria-label="Toggle menu"
			>
				{#if mobileOpen}
					<X size={24} />
				{:else}
					<Menu size={24} />
				{/if}
			</button>
		</div>

		<!-- Mobile menu -->
		{#if mobileOpen}
			<div class="md:hidden pt-4 pb-2 space-y-2">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={() => (mobileOpen = false)}
						class="block text-gray-600 hover:text-brand-600 transition font-light py-2"
					>
						{link.label}
					</a>
				{/each}
				{#if user}
					<a href="/dashboard" onclick={() => (mobileOpen = false)} class="block text-brand-600 font-normal py-2">Dashboard</a>
				{:else}
					<a href="/login" onclick={() => (mobileOpen = false)} class="block text-gray-600 hover:text-brand-600 transition font-light py-2">Sign in</a>
					<a href="/signup" onclick={() => (mobileOpen = false)} class="block text-brand-600 font-normal py-2">Get started</a>
				{/if}
			</div>
		{/if}
	</div>
</nav>

<main>
	{@render children()}
</main>

<!-- 4-column footer -->
<footer class="py-12 px-6 bg-gray-900 text-gray-400">
	<div class="max-w-7xl mx-auto">
		<div class="grid md:grid-cols-4 gap-8 mb-8">
			<div>
				<h4 class="text-white text-xl font-light mb-4">
					<span class="text-brand-500">Open</span>Attribution
				</h4>
				<p class="font-light text-sm">
					Open standards for AI content transparency.
				</p>
				<a
					href="/.well-known/openattribution.json"
					class="inline-block mt-4 text-xs font-light text-gray-500 hover:text-brand-500 transition"
				>
					Runs on OpenAttribution
				</a>
			</div>
			<div>
				<h5 class="text-white font-normal mb-4">Navigate</h5>
				<ul class="space-y-2 text-sm font-light">
					<li><a href="#problem" class="hover:text-brand-500 transition">The Problem</a></li>
					<li><a href="#standards" class="hover:text-brand-500 transition">Standards</a></li>
					<li><a href="#developers" class="hover:text-brand-500 transition">Developers</a></li>
					<li><a href="#roadmap" class="hover:text-brand-500 transition">Roadmap</a></li>
				</ul>
			</div>
			<div>
				<h5 class="text-white font-normal mb-4">Standards</h5>
				<ul class="space-y-2 text-sm font-light">
					<li><a href="https://github.com/openattribution-org/aims/blob/main/SPECIFICATION.md" target="_blank" rel="noopener noreferrer" class="hover:text-brand-500 transition">AIMS Specification</a></li>
					<li><a href="https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md" target="_blank" rel="noopener noreferrer" class="hover:text-brand-500 transition">Telemetry Specification</a></li>
					<li><a href="#faq" class="hover:text-brand-500 transition">FAQ</a></li>
					<li><a href="#governance" class="hover:text-brand-500 transition">Governance</a></li>
				</ul>
			</div>
			<div>
				<h5 class="text-white font-normal mb-4">Resources</h5>
				<ul class="space-y-2 text-sm font-light">
					<li><a href="/blog" class="hover:text-brand-500 transition">Blog</a></li>
					<li><a href="/policycheck" class="hover:text-brand-500 transition">PolicyCheck Tool</a></li>
					<li><a href="/feed.xml" class="hover:text-brand-500 transition">RSS Feed</a></li>
					<li><a href="#contact" class="hover:text-brand-500 transition">Get Involved</a></li>
					<li><a href="https://github.com/openattribution-org" target="_blank" rel="noopener noreferrer" class="hover:text-brand-500 transition">GitHub</a></li>
				</ul>
			</div>
		</div>
		<div class="pt-8 border-t border-gray-800 text-center text-sm font-light">
			<p>&copy; {new Date().getFullYear()} OpenAttribution. All rights reserved.</p>
		</div>
	</div>
</footer>
