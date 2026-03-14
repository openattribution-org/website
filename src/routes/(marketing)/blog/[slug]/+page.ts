import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { BlogPostMeta } from '../+page.server.js';
import type { Component } from 'svelte';

export const load: PageLoad = async ({ params }) => {
	const postFiles = import.meta.glob('/src/content/blog/*.md', { eager: true });

	// Build list for prev/next navigation
	const allPosts: { slug: string; meta: BlogPostMeta; component: Component }[] = Object.entries(
		postFiles
	).map(([path, module]) => {
		const mod = module as { default: Component; metadata: Record<string, unknown> };
		const slug = path.split('/').pop()!.replace('.md', '');
		return {
			slug,
			component: mod.default,
			meta: {
				title: mod.metadata.title as string,
				subtitle: mod.metadata.subtitle as string | undefined,
				date: String(mod.metadata.date),
				author: mod.metadata.author as string,
				tags: (mod.metadata.tags as string[]) ?? [],
				reading_time: (mod.metadata.reading_time as number) ?? 5,
				slug
			}
		};
	});

	allPosts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

	const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);
	if (currentIndex === -1) {
		error(404, 'Post not found');
	}

	const current = allPosts[currentIndex];

	return {
		post: current.meta,
		content: current.component,
		prev: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1].meta : null,
		next: currentIndex > 0 ? allPosts[currentIndex - 1].meta : null
	};
};
