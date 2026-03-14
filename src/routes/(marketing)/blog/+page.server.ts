import type { PageServerLoad } from './$types';

export interface BlogPostMeta {
	title: string;
	subtitle?: string;
	date: string;
	author: string;
	tags: string[];
	reading_time: number;
	slug: string;
}

export const load: PageServerLoad = async () => {
	const postFiles = import.meta.glob('/src/content/blog/*.md', { eager: true });

	const posts: BlogPostMeta[] = Object.entries(postFiles).map(([path, module]) => {
		const mod = module as { metadata: Record<string, unknown> };
		const slug = path.split('/').pop()!.replace('.md', '');

		return {
			title: mod.metadata.title as string,
			subtitle: mod.metadata.subtitle as string | undefined,
			date: String(mod.metadata.date),
			author: mod.metadata.author as string,
			tags: (mod.metadata.tags as string[]) ?? [],
			reading_time: (mod.metadata.reading_time as number) ?? 5,
			slug
		};
	});

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { posts };
};
