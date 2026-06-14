import z from "zod";

export const customerSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  position: z.string(),
  email: z.string(),
  customerId: z.number(),
  customerName: z.string().default(""),
});

export const customersSchema = z.array(customerSchema);

export type CustomerRow = z.infer<typeof customerSchema>;
