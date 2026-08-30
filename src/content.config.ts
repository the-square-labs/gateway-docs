import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				description: z.string(),
				section: z.string(),
				order: z.number().int().positive(),
				audience: z.array(z.string()).min(1),
				status: z.enum(['ready', 'preview', 'in-development']),
				lastReviewed: z.coerce.date(),
			}),
		}),
	}),
};
