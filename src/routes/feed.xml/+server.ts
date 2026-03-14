import type { RequestHandler } from './$types';

interface PostMeta {
	title: string;
	subtitle?: string;
	date: string;
	author: string;
	tags: string[];
}

export const GET: RequestHandler = async () => {
	const postFiles = import.meta.glob('/src/content/blog/*.md', { eager: true });

	const posts: { slug: string; meta: PostMeta }[] = Object.entries(postFiles).map(
		([path, module]) => {
			const mod = module as { metadata: Record<string, unknown> };
			const slug = path.split('/').pop()!.replace('.md', '');
			return {
				slug,
				meta: {
					title: mod.metadata.title as string,
					subtitle: mod.metadata.subtitle as string | undefined,
					date: String(mod.metadata.date),
					author: mod.metadata.author as string,
					tags: (mod.metadata.tags as string[]) ?? []
				}
			};
		}
	);

	posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

	const siteUrl = 'https://openattribution.org';

	const items = posts
		.slice(0, 20)
		.map(
			({ slug, meta }) => `
    <item>
      <title>${escapeXml(meta.title)}</title>
      <description>${escapeXml(meta.subtitle ?? '')}</description>
      <pubDate>${new Date(meta.date).toUTCString()}</pubDate>
      <link>${siteUrl}/blog/${slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${slug}</guid>
      ${meta.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenAttribution Blog</title>
    <description>News and perspectives on AI content transparency, attribution standards, and the evolving relationship between AI systems and content creators.</description>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
};

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
