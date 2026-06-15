import z from "zod";

export const contactSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  position: z.string(),
  email: z.string(),
  customerId: z.number(),
  customerName: z.string().default(""),
});

export const contactsSchema = z.array(contactSchema);

export type ContactRow = z.infer<typeof contactSchema>;
