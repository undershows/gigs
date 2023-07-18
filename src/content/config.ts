import { z, defineCollection } from 'astro:content';

const stateCollection = defineCollection({
  schema: z.object({
    abbr: z.string(),
    name: z.string(),
    gigs: z.array(z.object({
      poster: z.string(),
      date: z.string().regex(
        /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/([0-9]{4,})\s([0-1][0-9]|2[0-3]):([0-5][0-9])$/,
        { message: 'Invalid date. Use the following format: DD/MM/YYYY HH:mm' }
      ),
      city: z.string(),
      daysGroup: z.string().regex(
        /^(0[1-9]|[1-2][0-9]|3[0-1])(\/(0[1-9]|[1-2][0-9]|3[0-1]))*$/,
        { message: 'Invalid days group. Example: 09/10/11' }
      ).optional(),
      ticketsUrl: z.string().url().optional()
    })).optional()
  })
});

export const collections = {
  'state': stateCollection
};
