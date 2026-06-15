import z from "zod";

export const noteSchema = z.object({
  id: z.number(),
  content: z.string(),
  customerId: z.number(),
  customerName: z.string().default(""),
});

export const notesSchema = z.array(noteSchema);

export type NoteRow = z.infer<typeof noteSchema>;
