import z from "zod";

export const noteSchema = z.object({
  id: z.number(),
  fileName: z.string(),
  extension: z.string(),
  uploadedAt: z.string(),
});

export const notesSchema = z.array(noteSchema);

export type NoteRow = z.infer<typeof noteSchema>;