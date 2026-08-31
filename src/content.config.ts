import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			// OpenAPI pages are injected at build time with Starlight's base frontmatter.
			// scripts/validate-content.mjs still requires these fields on every authored page.
			extend: z.object({
				description: z.string().optional(),
				section: z.string().optional(),
				order: z.number().int().positive().optional(),
				audience: z.array(z.string()).min(1).optional(),
				status: z.enum(['ready', 'preview', 'in-development']).optional(),
				lastReviewed: z.coerce.date().optional(),
			}),
		}),
	}),
};
