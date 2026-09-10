import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware(({ locals, url }) => {
	if (url.pathname !== '/api' && !url.pathname.startsWith('/api/')) return;
	const route = locals.starlightRoute;
	const apiUrl = (value: string) => value.replace(/\/(?:en|ru)\/api(?=\/|$)/, '/api');

	// Starlight assumes localized paths, but starlight-openapi generates /api/ only.
	route.head = route.head
		.filter(({ tag, attrs }) => !(tag === 'link' && attrs?.rel === 'alternate' && attrs?.hreflang))
		.map((entry) => {
			if (entry.tag === 'link' && entry.attrs?.rel === 'canonical' && typeof entry.attrs.href === 'string') {
				return { ...entry, attrs: { ...entry.attrs, href: apiUrl(entry.attrs.href) } };
			}
			if (entry.tag === 'meta' && entry.attrs?.property === 'og:url' && typeof entry.attrs.content === 'string') {
				return { ...entry, attrs: { ...entry.attrs, content: apiUrl(entry.attrs.content) } };
			}
			return entry;
		});

	if (url.pathname !== '/api/' && url.pathname !== '/api') return;
	// The plugin labels this section "API groups" but renders id="operations".
	const fixHeadings = (items: NonNullable<StarlightRouteData['toc']>['items']) => {
		for (const item of items) {
			if (item.slug === 'api-groups') item.slug = 'operations';
			fixHeadings(item.children);
		}
	};
	if (route.toc) fixHeadings(route.toc.items);
	for (const heading of route.headings) {
		if (heading.slug === 'api-groups') heading.slug = 'operations';
	}
});
