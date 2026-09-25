// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';
import starlightLlmsTxt from 'starlight-llms-txt';

const docsSite = 'https://docs.goodgateway.dev';

/** Curated entry points for /llms.txt. Keep descriptions to one line and English only. */
const llmsLinkSections = [
	{
		title: 'Evaluate and buy',
		links: [
			['getting-started/evaluating-gateway', 'Evaluating Gateway', 'pre-purchase FAQ: self-hosting and where keys live, license checks and expiry, permissions on unadopted containers, adopting existing Compose projects, migration help'],
			['getting-started/why-gateway', 'Why Gateway', 'what the product does, which problems it solves, and where its responsibility ends'],
			['getting-started/product-tour', 'Product tour', 'the main product areas and how they connect'],
			['reference/plans-and-entitlements', 'Plans and entitlements', 'Community, Personal, Business, and Enterprise feature matrix, limits, license checks, expiry, grace, and downgrade behavior'],
			['reference/capabilities', 'Capability index', 'current product areas, readiness status, and target versions for roadmap items'],
			['getting-started/adoption-pilot', 'Adoption pilot', 'staged, reversible evaluation plan with gates and evidence'],
		],
	},
	{
		title: 'Install and architecture',
		links: [
			['getting-started/requirements', 'Requirements and planning', 'host, network, and recovery prerequisites for a self-hosted installation'],
			['getting-started/install', 'Install Gateway', 'one-command self-hosted installation and browser setup'],
			['getting-started/manual-install', 'Manual installation', 'install without piping a script, with locally generated secrets and optional digest verification'],
			['concepts/architecture', 'Architecture', 'control plane, Relay, and role-specific Node daemons'],
			['operations/updates-backups', 'Updates, backups, and restore', 'control-plane recovery set, master keys, and upgrade procedure'],
		],
	},
	{
		title: 'Security and access',
		links: [
			['security/security-model', 'Security model', 'trust boundaries, secret handling, and what leaves a self-hosted installation'],
			['concepts/permissions', 'Permissions and scopes', 'global, Node, folder, and resource-scoped grants, restricting a team to one project folder, and access to unmanaged containers and external Compose projects'],
			['identity/scopes-reference', 'Scope reference', 'every permission scope, the resource levels it supports, implied view access, folder support by resource type, and scope names retired in 2.11'],
			['identity/scopes-tokens-oauth', 'Scopes, API tokens, OAuth, and MCP', 'delegated credentials and consent, including limiting tokens and OAuth grants to folders or resources'],
			['security/hardening', 'Hardening checklist', 'production hardening steps'],
		],
	},
	{
		title: 'Docker and Compose',
		links: [
			['docker/overview', 'Docker overview', 'choose between Containers, Deployments, Compose Projects, and Git sources'],
			['docker/containers', 'Containers', 'standalone containers, including containers Gateway did not create'],
			['docker/compose', 'Compose Projects', 'external project discovery, adoption of an existing Compose project, revisions, env files, bind mounts, one-off jobs, and volume names'],
			['docker/migrations-archives', 'Migrations and container archives', 'cross-node migration and GWCA export/import limits'],
			['docker/images-volumes-networks', 'Images, volumes, and networks', 'shared Docker resources and volume ownership'],
		],
	},
	{
		title: 'Databases',
		links: [
			['databases/overview', 'Databases overview', 'managed versus external PostgreSQL, Redis, and ClickHouse: what Gateway runs versus only connects to, and TLS certificate verification for external connections'],
			['databases/managed-databases', 'Managed databases', 'provision, resize, pause, publish, and retire managed instances'],
			['databases/bindings', 'Application database bindings', 'private workload access to managed databases through a dedicated engine identity per binding'],
			['databases/backups', 'Database backups', 'scheduled native backups of managed and external PostgreSQL, Redis, and ClickHouse to storage connections, and restore'],
			['databases/operations', 'Database operations', 'monitoring, explorers, consoles, and recovery runbooks'],
			['storage/overview', 'Storage', 'S3-compatible, FTP, FTPS, and SFTP storage connections, managed SeaweedFS object storage with private workload links and automatic certificate renewal, server-side copy jobs, and migrating from MinIO with the built-in assistant'],
			['journeys/private-database', 'Connect an application to a private database', 'end-to-end managed database and binding journey'],
		],
	},
	{
		title: 'Automation and AI',
		links: [
			['integrations/api-and-mcp', 'REST API and MCP', 'programmatic access with scoped tokens, OAuth, and remote MCP'],
			['ai/agent-skills', 'AI agent skills', 'connect Codex, Claude Code, and other agents through authenticated MCP'],
		],
	},
];

const llmsDetails = [
	'Key facts:',
	'',
	'- Every plan (Community, Personal, Business, and Enterprise) can be self-hosted. A managed cloud option is offered separately by request; it is never required.',
	'- Community needs no license key and allows 25 managed Nodes, 3 users, and 1 custom permission group. Since 2.11, external database connections, storage connections, database backups, GitLab integration, and AI Plan Mode, Scenarios, and Sandboxes require Personal or higher.',
	'- In a self-hosted installation, encrypted credentials, keys, and operational data stay in your installation. The license service receives only installation metadata described in the plans page; every Gateway update authorizes the target release with it, and licensed installations download a signed commercial core from it.',
	'- Gateway 2.11 renamed or merged several permission scopes; the old names are still accepted on input for two releases and are converted to the new ones.',
	'- When a paid plan expires, is downgraded, revoked, or cannot be validated, running workloads, Routes, and data keep working; after the documented grace periods, creating paid resources and changing their configuration are blocked, and SIEM forwarding and external registry access pause until renewal. License states are signed by the license service and verified by Gateway.',
	'- English and Russian documentation have the same structure; URLs below use the English locale (`/en/`). The Russian locale is under `/ru/`.',
	'',
	...llmsLinkSections.flatMap(({ title, links }) => [
		`## ${title}`,
		'',
		...links.map(([slug, label, description]) => `- [${label}](${docsSite}/en/${slug}/): ${description}`),
		'',
	]),
].join('\n').trim();

export default defineConfig({
	site: docsSite,
	output: 'static',
	trailingSlash: 'always',
	vite: {
		ssr: {
			// Prevent Starlight's Satteri 0.9 native binding from being bundled in place of
			// the 0.10 binding used by starlight-openapi's Markdown renderer.
			external: ['satteri'],
		},
	},
	integrations: [
		mermaid({
			autoTheme: true,
			enableLog: false,
			mermaidConfig: {
				flowchart: { curve: 'linear' },
			},
		}),
		sitemap({
			i18n: {
				defaultLocale: 'en',
				locales: { en: 'en', ru: 'ru' },
			},
		}),
		starlight({
			title: 'Good Gateway',
			plugins: [
				starlightLlmsTxt({
					projectName: 'Good Gateway',
					description:
						'Good Gateway is a self-hosted infrastructure control plane. It lets people, automation, and AI agents operate ingress (domains, nginx Routes, TLS), Docker workloads (Containers, blue/green Deployments, Compose Projects, Git builds), external and managed databases (PostgreSQL, Redis, ClickHouse), static Pages, monitoring, and access control through one permission model, REST API, and MCP. Managed Linux hosts run role-specific daemons that connect outbound through Gateway Relay, so applications and data keep running on infrastructure you own.',
					details: llmsDetails,
					promote: ['en', 'en/getting-started/evaluating-gateway', 'en/getting-started/**', 'en/reference/plans-and-entitlements', 'en/concepts/**'],
					demote: ['en/success-stories/**'],
					exclude: ['en/success-stories/**'],
					customSelectors: { all: ['.sl-anchor-link', '.gg-copy-prompt-button'] },
					optionalLinks: [
						{
							label: 'Good Gateway website',
							url: 'https://goodgateway.dev/',
							description: 'product overview, self-hosted and managed cloud options, and published plan pricing',
						},
						{
							label: 'Russian documentation',
							url: `${docsSite}/ru/`,
							description: 'the same documentation in Russian',
						},
						{
							label: 'Source code',
							url: 'https://github.com/the-square-labs/gateway',
							description: 'public Gateway source under PolyForm Perimeter 1.0.1 with the Product Continuity MIT Grant',
						},
					],
				}),
				starlightOpenAPI([
					{
						base: 'api',
						schema: './public/api/openapi.json',
						sidebar: {
							collapsed: true,
							label: 'API Reference',
						},
					},
				]),
			],
			disable404Route: true,
			titleDelimiter: '·',
			description: 'Operate Good Gateway with production-ready guides, runbooks, and reference documentation.',
			favicon: '/favicon.ico',
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
			routeMiddleware: './src/routeData.ts',
			components: {
				SocialIcons: './src/components/HeaderLinks.astro',
				LanguageSelect: './src/components/LanguageSelect.astro',
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/the-square-labs/gateway',
				},
			],
			head: [
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' } },
				{ tag: 'script', attrs: { type: 'module', src: '/scripts/image-zoom.js' } },
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
					label: 'Customer stories',
					translations: { ru: 'Истории клиентов' },
					collapsed: true,
					items: [
						{ slug: 'success-stories/wiolett-industries' },
						{ slug: 'success-stories/remedy-trade' },
						{ slug: 'success-stories/just-working' },
						{ slug: 'success-stories/dfk-algotrade' },
						{ slug: 'success-stories/square-labs' },
					],
				},
				{
					label: 'Start here',
					translations: { ru: 'Начало работы' },
					items: [
						{ slug: 'index' },
						{ slug: 'getting-started/evaluating-gateway' },
						{ slug: 'getting-started/why-gateway' },
						{ slug: 'getting-started/product-tour' },
						{ slug: 'getting-started/adoption-pilot' },
						{ slug: 'getting-started/requirements' },
						{ slug: 'getting-started/install' },
						{ slug: 'getting-started/manual-install' },
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
						{ slug: 'concepts/iac-and-ownership' },
						{ slug: 'concepts/resource-model' },
						{ slug: 'concepts/permissions' },
						{ slug: 'concepts/secure-links' },
						{ slug: 'concepts/lifecycle-and-safety' },
						{ slug: 'concepts/plugin-system' },
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
					label: 'AI and inference',
					translations: { ru: 'AI и inference' },
					items: [
						{ slug: 'ai/agent-skills' },
						{ slug: 'ai/workspace' },
						{ slug: 'ai/inference' },
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
						{ slug: 'docker/availability' },
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
						{ slug: 'databases/backups' },
						{ slug: 'databases/operations' },
					],
				},
				{
					label: 'Storage',
					translations: { ru: 'Хранилища' },
					items: [{ slug: 'storage/overview' }],
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
						{ slug: 'identity/scopes-reference' },
					],
				},
				{
					label: 'Integrations',
					translations: { ru: 'Интеграции' },
					items: [
						{ slug: 'integrations/overview' },
						{ slug: 'integrations/hosting-providers' },
						{ slug: 'integrations/source-control' },
						{ slug: 'integrations/ssh-connections' },
						{ slug: 'integrations/cloudflare' },
						{ slug: 'integrations/dns-email-webhooks' },
					],
				},
				{
					label: 'Automation',
					translations: { ru: 'Автоматизация' },
					items: [
						{ slug: 'integrations/api-and-mcp' },
					],
				},
				{
					label: 'Operations and security',
					translations: { ru: 'Эксплуатация и безопасность' },
					items: [
						{ slug: 'operations/production-checklist' },
						{ slug: 'operations/availability-compatibility-limits' },
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
				...openAPISidebarGroups,
			],
		}),
	],
});
