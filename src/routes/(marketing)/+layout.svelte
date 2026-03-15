<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Menu, X } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const user = $derived($page.data.user);
	const isHome = $derived($page.url.pathname === '/');
	let mobileOpen = $state(false);
	let scrolled = $state(false);

	const navLinks = [
		{ href: '/#demo', label: 'Demo' },
		{ href: '/policycheck', label: 'PolicyCheck' },
		{ href: '/members', label: 'Members' },
		{ href: '/docs', label: 'Docs' },
		{ href: '/#contact', label: 'Contact' }
	];

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 80;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const navTransparent = $derived(isHome && !scrolled);
</script>

<!-- Marketing Nav -->
<nav class="fixed w-full z-50 transition-all duration-300 {navTransparent ? 'bg-transparent' : 'bg-white/80 backdrop-blur-md border-b border-brand-100'}">
	<div class="max-w-7xl mx-auto px-6 py-4">
		<div class="flex items-center justify-between">
			<a href="/" class="text-2xl font-light tracking-tight">
				{#if navTransparent}
					<span class="text-brand-400">Open</span><span class="text-white">Attribution</span>
				{:else}
					<span class="text-brand-600">Open</span><span class="text-gray-800">Attribution</span>
				{/if}
			</a>

			<!-- Desktop nav -->
			<div class="hidden md:flex items-center gap-8">
				{#each navLinks as link}
					<a href={link.href} class="transition font-light {navTransparent ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-brand-600'}">
						{link.label}
					</a>
				{/each}

				{#if user}
					<a href="/dashboard" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-normal text-sm">
						Dashboard
					</a>
				{:else}
					<a href="/login" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-normal text-sm">
						Sign in
					</a>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<button
				onclick={() => (mobileOpen = !mobileOpen)}
				class="md:hidden p-2 {navTransparent ? 'text-white' : 'text-gray-600'}"
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
			<div class="md:hidden pt-4 pb-2 space-y-2 {navTransparent ? 'text-gray-200' : ''}">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={() => (mobileOpen = false)}
						class="block transition font-light py-2 {navTransparent ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-brand-600'}"
					>
						{link.label}
					</a>
				{/each}
				{#if user}
					<a href="/dashboard" onclick={() => (mobileOpen = false)} class="block text-brand-600 font-normal py-2">Dashboard</a>
				{:else}
					<a href="/login" onclick={() => (mobileOpen = false)} class="block text-brand-600 font-normal py-2">Sign in</a>
				{/if}
			</div>
		{/if}
	</div>
</nav>

<main class="overflow-x-clip">
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
				<h5 class="text-white font-normal mb-4">Get started</h5>
				<ul class="space-y-2 text-sm font-light">
					<li><a href="/policycheck" class="hover:text-brand-500 transition">Check your domain</a></li>
					<li><a href="/login" class="hover:text-brand-500 transition">Claim your domain</a></li>
					<li><a href="#how-it-works" class="hover:text-brand-500 transition">How it works</a></li>
					<li><a href="#faq" class="hover:text-brand-500 transition">FAQ</a></li>
				</ul>
			</div>
			<div>
				<h5 class="text-white font-normal mb-4">Standards</h5>
				<ul class="space-y-2 text-sm font-light">
					<li><a href="/docs" class="hover:text-brand-500 transition">Documentation</a></li>
					<li><a href="https://github.com/openattribution-org/aims/blob/main/SPECIFICATION.md" target="_blank" rel="noopener noreferrer" class="hover:text-brand-500 transition">AIMS Specification</a></li>
					<li><a href="https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md" target="_blank" rel="noopener noreferrer" class="hover:text-brand-500 transition">Telemetry Specification</a></li>
					<li><a href="#developers" class="hover:text-brand-500 transition">Developer SDKs</a></li>
				</ul>
			</div>
			<div>
				<h5 class="text-white font-normal mb-4">Resources</h5>
				<ul class="space-y-2 text-sm font-light">
					<li><a href="/members" class="hover:text-brand-500 transition">Members</a></li>
					<li><a href="/#contact" class="hover:text-brand-500 transition">Contact</a></li>
					<li><a href="https://github.com/openattribution-org" target="_blank" rel="noopener noreferrer" class="hover:text-brand-500 transition">GitHub</a></li>
				</ul>
			</div>
		</div>
		<div class="pt-8 border-t border-gray-800 text-center text-sm font-light">
			<p>&copy; {new Date().getFullYear()} OpenAttribution. All rights reserved.</p>
		</div>
	</div>
</footer>
