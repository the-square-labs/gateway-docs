import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const contentRoot = join(root, 'src', 'content', 'docs');
const publicRoot = join(root, 'public');
const locales = ['en', 'ru'];
const errors = [];

function filesUnder(directory) {
	if (!existsSync(directory)) return [];
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		return entry.isDirectory() ? filesUnder(path) : [path];
	});
}

function contentFiles(locale) {
	const localeRoot = join(contentRoot, locale);
	return filesUnder(localeRoot)
		.filter((file) => ['.md', '.mdx'].includes(extname(file)))
		.map((file) => relative(localeRoot, file).split(sep).join('/'))
		.sort();
}

function frontmatter(source) {
	const match = source.match(/^---\n([\s\S]*?)\n---/);
	return match?.[1] ?? '';
}

function contentTargetExists(absolute, locale, target) {
	const clean = target.split('#', 1)[0].split('?', 1)[0];
	if (!clean) return true;

	let base;
	if (clean.startsWith('/')) {
		const prefix = `/${locale}/`;
		if (!clean.startsWith(prefix)) return true;
		base = join(contentRoot, locale, clean.slice(prefix.length));
	} else {
		base = resolve(dirname(absolute), clean);
	}

	return [base, `${base}.md`, `${base}.mdx`, join(base, 'index.md'), join(base, 'index.mdx')].some(existsSync);
}

const byLocale = Object.fromEntries(locales.map((locale) => [locale, contentFiles(locale)]));
const expected = byLocale.en;

for (const locale of locales) {
	const missing = expected.filter((file) => !byLocale[locale].includes(file));
	const extra = byLocale[locale].filter((file) => !expected.includes(file));
	for (const file of missing) errors.push(`${locale}: missing translated page ${file}`);
	for (const file of extra) errors.push(`${locale}: page has no English source ${file}`);
}

for (const locale of locales) {
	for (const file of byLocale[locale]) {
		const absolute = join(contentRoot, locale, file);
		const source = readFileSync(absolute, 'utf8');
		const metadata = frontmatter(source);

		for (const field of ['title', 'description', 'section', 'order', 'audience', 'status', 'lastReviewed']) {
			if (!new RegExp(`^${field}:`, 'm').test(metadata)) {
				errors.push(`${locale}/${file}: missing frontmatter field ${field}`);
			}
		}

		for (const match of source.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
			const target = match[1];
			const resolved = target.startsWith('/')
				? join(publicRoot, target.slice(1))
				: resolve(dirname(absolute), target);
			if (!existsSync(resolved)) errors.push(`${locale}/${file}: missing image ${target}`);
		}

		for (const match of source.matchAll(/(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
			const target = match[1];
			if (/^(?:https?:|mailto:|tel:|#)/.test(target)) continue;
			if (!contentTargetExists(absolute, locale, target)) {
				errors.push(`${locale}/${file}: broken internal link ${target}`);
			}
		}

		if (/\/(Users|home)\//.test(source)) errors.push(`${locale}/${file}: contains a local filesystem path`);
		if (/\b(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)\d{1,3}\.\d{1,3}\b/.test(source)) {
			errors.push(`${locale}/${file}: contains a private-network address`);
		}
	}
}

if (errors.length > 0) {
	console.error(errors.join('\n'));
	process.exit(1);
}

console.log(`Validated ${expected.length} pages across ${locales.length} locales.`);
