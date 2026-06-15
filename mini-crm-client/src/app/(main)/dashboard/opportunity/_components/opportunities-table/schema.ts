import z from "zod";

export const opportunitySchema = z.object({
  id: z.number(),
  title: z.string(),
  value: z.number(),
  stage: z.string(),
  customerId: z.number(),
  customerName: z.string().default(""),
});

export const opportunitiesSchema = z.array(opportunitySchema);

export type OpportunityRow = z.infer<typeof opportunitySchema>;
