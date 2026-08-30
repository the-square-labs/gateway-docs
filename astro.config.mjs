// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://docs.goodgateway.dev',
	output: 'static',
	trailingSlash: 'always',
	integrations: [
		sitemap({
			i18n: {
				defaultLocale: 'en',
				locales: { en: 'en', ru: 'ru' },
			},
		}),
		starlight({
			title: 'Good Gateway',
			disable404Route: true,
			titleDelimiter: '·',
			description: 'Operate Good Gateway with production-ready guides, runbooks, and reference documentation.',
			favicon: '/favicon.png',
			logo: {
				src: './src/assets/good-gateway-logo.png',
				alt: 'Good Gateway',
			},
			defaultLocale: 'en',
			locales: {
				en: { label: 'English', lang: 'en' },
				ru: { label: 'Русский', lang: 'ru' },
			},
			lastUpdated: true,
			pagefind: true,
			customCss: ['./src/styles/custom.css'],
			editLink: {
				baseUrl: 'https://github.com/the-square-labs/gateway-docs/edit/main/src/content/docs/',
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/the-square-labs/gateway-docs',
				},
			],
			head: [
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'Good Gateway Documentation' } },
				{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: 'https://docs.goodgateway.dev/brand/good-gateway-lockup-light.png',
					},
				},
				{ tag: 'meta', attrs: { property: 'og:image:alt', content: 'Good Gateway' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'link', attrs: { rel: 'sitemap', href: '/sitemap-index.xml' } },
			],
			sidebar: [
				{
					label: 'Start here',
					translations: { ru: 'Начало работы' },
					items: [
						{ slug: 'index' },
						{ slug: 'getting-started/product-tour' },
						{ slug: 'getting-started/requirements' },
						{ slug: 'getting-started/install' },
						{ slug: 'getting-started/initial-setup' },
						{ slug: 'getting-started/first-node' },
						{ slug: 'getting-started/first-route' },
					],
				},
				{
					label: 'Concepts',
					translations: { ru: 'Концепции' },
					items: [
						{ slug: 'concepts/architecture' },
						{ slug: 'concepts/resource-model' },
						{ slug: 'concepts/permissions' },
						{ slug: 'concepts/secure-links' },
						{ slug: 'concepts/lifecycle-and-safety' },
					],
				},
				{
					label: 'End-to-end journeys',
					translations: { ru: 'Сквозные сценарии' },
					items: [
						{ slug: 'journeys/publish-application' },
						{ slug: 'journeys/git-to-production' },
						{ slug: 'journeys/private-database' },
						{ slug: 'journeys/static-site' },
					],
				},
				{
					label: 'Ingress',
					translations: { ru: 'Входящий трафик' },
					items: [
						{ slug: 'ingress/overview' },
						{ slug: 'ingress/domains-routes-tls' },
						{ slug: 'ingress/access-maintenance' },
						{ slug: 'ingress/secure-upstreams' },
						{ slug: 'ingress/troubleshooting' },
					],
				},
				{
					label: 'Nodes and Relay',
					translations: { ru: 'Ноды и Relay' },
					items: [
						{ slug: 'nodes/overview' },
						{ slug: 'nodes/roles-and-installation' },
						{ slug: 'nodes/updates-and-offline-behavior' },
						{ slug: 'nodes/relay-pool' },
					],
				},
				{
					label: 'Docker',
					items: [
						{ slug: 'docker/overview' },
						{ slug: 'docker/containers' },
						{ slug: 'docker/deployments' },
						{ slug: 'docker/compose' },
						{ slug: 'docker/git-builds' },
						{ slug: 'docker/migrations-archives' },
						{ slug: 'docker/images-volumes-networks' },
						{ slug: 'docker/registries' },
					],
				},
				{
					label: 'Databases',
					translations: { ru: 'Базы данных' },
					items: [
						{ slug: 'databases/overview' },
						{ slug: 'databases/managed-databases' },
						{ slug: 'databases/bindings' },
						{ slug: 'databases/operations' },
					],
				},
				{
					label: 'Pages',
					items: [{ slug: 'pages/overview' }, { slug: 'pages/git-deployments' }],
				},
				{
					label: 'Certificates and PKI',
					translations: { ru: 'Сертификаты и PKI' },
					items: [
						{ slug: 'certificates/ssl-certificates' },
						{ slug: 'certificates/internal-pki' },
					],
				},
				{
					label: 'Observe and notify',
					translations: { ru: 'Наблюдаемость и уведомления' },
					items: [
						{ slug: 'observability/overview' },
						{ slug: 'observability/notifications-status-pages' },
						{ slug: 'observability/structured-logging-siem' },
					],
				},
				{
					label: 'Identity and access',
					translations: { ru: 'Идентификация и доступ' },
					items: [
						{ slug: 'identity/auth-users-groups' },
						{ slug: 'identity/scopes-tokens-oauth' },
					],
				},
				{
					label: 'Integrations and automation',
					translations: { ru: 'Интеграции и автоматизация' },
					items: [
						{ slug: 'integrations/source-control' },
						{ slug: 'integrations/dns-email-webhooks' },
						{ slug: 'integrations/api-and-mcp' },
					],
				},
				{
					label: 'AI and inference',
					translations: { ru: 'AI и inference' },
					items: [{ slug: 'ai/workspace' }, { slug: 'ai/inference' }],
				},
				{
					label: 'Operations and security',
					translations: { ru: 'Эксплуатация и безопасность' },
					items: [
						{ slug: 'operations/production-checklist' },
						{ slug: 'operations/updates-backups' },
						{ slug: 'operations/incident-runbook' },
						{ slug: 'security/security-model' },
						{ slug: 'security/hardening' },
					],
				},
				{
					label: 'Reference',
					translations: { ru: 'Справочник' },
					items: [
						{ slug: 'reference/capabilities' },
						{ slug: 'reference/plans-and-entitlements' },
						{ slug: 'reference/ports-and-network' },
						{ slug: 'reference/tasks-and-audit' },
						{ slug: 'reference/glossary' },
					],
				},
			],
		}),
	],
});
