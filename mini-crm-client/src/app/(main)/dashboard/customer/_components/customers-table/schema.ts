import z from "zod";

export const opportunitySchema = z.object({
  id: z.number(),
  name: z.string(),
  industry: z.string(),
  website: z.string(),
  email: z.string(),
  phone: z.string(),
});

export const opportunitiesSchema = z.array(opportunitySchema);

export type OpportunityRow = z.infer<typeof opportunitySchema>;
