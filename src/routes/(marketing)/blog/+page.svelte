<script lang="ts">
	import type { BlogPostMeta } from './+page.server.js';

	let { data }: { data: { posts: BlogPostMeta[] } } = $props();

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
	<title>Blog - OpenAttribution</title>
	<meta name="description" content="News and perspectives on AI content transparency, attribution standards, and the evolving relationship between AI systems and content creators." />
</svelte:head>

<section class="pt-32 pb-12 px-6 bg-gradient-to-br from-brand-50 via-cream to-amber-50">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-4xl lg:text-5xl mb-4">Blog</h1>
		<p class="text-xl text-gray-600 font-light">
			News and perspectives on AI content transparency.
		</p>
		<div class="mt-4">
			<a href="/feed.xml" class="text-sm text-brand-600 hover:underline font-light">RSS Feed</a>
		</div>
	</div>
</section>

<section class="py-12 px-6">
	<div class="max-w-4xl mx-auto space-y-8">
		{#each data.posts as post}
			<a href="/blog/{post.slug}" class="block bg-white rounded-2xl shadow-lg border border-brand-100 p-8 hover:shadow-xl transition group">
				<div class="flex items-center gap-3 mb-3 text-sm text-gray-500 font-light">
					<time datetime={post.date}>{formatDate(post.date)}</time>
					<span>&middot;</span>
					<span>{post.reading_time} min read</span>
				</div>
				<h2 class="text-2xl font-normal mb-2 group-hover:text-brand-600 transition">{post.title}</h2>
				{#if post.subtitle}
					<p class="text-gray-600 font-light leading-relaxed mb-4">{post.subtitle}</p>
				{/if}
				<div class="flex flex-wrap gap-2">
					{#each post.tags as tag}
						<span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium {tagColours[tag] ?? 'bg-gray-100 text-gray-700'}">
							{tag}
						</span>
					{/each}
				</div>
			</a>
		{/each}
	</div>
</section>
