import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.string(),
  status: z.enum(["Active", "Suspended", "Deactivated"]),
  joinedDate: z.string(),
});

export const usersSchema = z.array(userSchema);

export type UserRow = z.infer<typeof userSchema>;
