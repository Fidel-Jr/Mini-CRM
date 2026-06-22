import z from "zod";

export const customerSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.string(),
  status: z.enum(["Active", "Suspended", "Deactivated"]),
  joinedDate: z.string(),
});

export const customersSchema = z.array(customerSchema);

export type CustomerRow = z.infer<typeof customerSchema>;
