<script lang="ts">
	import type { BlogPostMeta } from '../+page.server.js';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import type { Component } from 'svelte';

	let { data }: { data: { post: BlogPostMeta; content: Component; prev: BlogPostMeta | null; next: BlogPostMeta | null } } = $props();

	const Content = $derived(data.content);

	const tagColours: Record<string, string> = {
		essay: 'bg-brand-100 text-brand-800',
		industry: 'bg-amber-100 text-amber-800',
		policy: 'bg-blue-100 text-blue-800',
		tools: 'bg-green-100 text-green-800',
		commerce: 'bg-purple-100 text-purple-800',
		standards: 'bg-amber-100 text-amber-800'
	};

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{data.post.title} - OpenAttribution</title>
	{#if data.post.subtitle}
		<meta name="description" content={data.post.subtitle} />
	{/if}
</svelte:head>

<article class="pt-32 pb-20 px-6">
	<div class="max-w-3xl mx-auto">
		<!-- Header -->
		<header class="mb-12">
			<div class="flex items-center gap-3 mb-4 text-sm text-gray-500 font-light">
				<a href="/blog" class="text-brand-600 hover:underline">&larr; Blog</a>
				<span>&middot;</span>
				<time datetime={data.post.date}>{formatDate(data.post.date)}</time>
				<span>&middot;</span>
				<span>{data.post.reading_time} min read</span>
			</div>

			<h1 class="text-3xl lg:text-4xl mb-4">{data.post.title}</h1>

			{#if data.post.subtitle}
				<p class="text-xl text-gray-600 font-light leading-relaxed mb-6">{data.post.subtitle}</p>
			{/if}

			<div class="flex items-center gap-4">
				<span class="text-sm text-gray-600 font-light">By {data.post.author}</span>
				<div class="flex flex-wrap gap-2">
					{#each data.post.tags as tag}
						<span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium {tagColours[tag] ?? 'bg-gray-100 text-gray-700'}">
							{tag}
						</span>
					{/each}
				</div>
			</div>
		</header>

		<!-- Content -->
		<div class="prose prose-lg prose-gray max-w-none
			prose-headings:font-normal prose-headings:text-gray-900
			prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
			prose-strong:font-normal
			prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-gray-200 prose-code:before:content-none prose-code:after:content-none
			prose-blockquote:border-brand-600 prose-blockquote:font-light
			prose-li:font-light
			prose-p:font-light">
			<Content />
		</div>

		<!-- Prev/Next -->
		<nav class="mt-16 pt-8 border-t border-gray-200">
			<div class="flex justify-between gap-8">
				{#if data.prev}
					<a href="/blog/{data.prev.slug}" class="flex-1 group">
						<div class="flex items-center gap-2 text-sm text-gray-500 font-light mb-1">
							<ArrowLeft size={14} />
							Previous
						</div>
						<p class="font-normal group-hover:text-brand-600 transition">{data.prev.title}</p>
					</a>
				{:else}
					<div class="flex-1"></div>
				{/if}
				{#if data.next}
					<a href="/blog/{data.next.slug}" class="flex-1 text-right group">
						<div class="flex items-center justify-end gap-2 text-sm text-gray-500 font-light mb-1">
							Next
							<ArrowRight size={14} />
						</div>
						<p class="font-normal group-hover:text-brand-600 transition">{data.next.title}</p>
					</a>
				{:else}
					<div class="flex-1"></div>
				{/if}
			</div>
		</nav>
	</div>
</article>
