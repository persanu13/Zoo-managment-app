import z from "zod";

export const TreatmentSchema = z.object({
  id: z.string().cuid(),

  animalId: z.string().cuid(),

  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(120, "Title must be at most 120 characters"),

  notes: z
    .string()
    .trim()
    .max(10_000, "Notes must be at most 10,000 characters")
    .nullish(),

  createdById: z.string().cuid(),
  date: z.coerce.date(),

  createdAt: z.date(),
});

export const CreateTreatmentSchema = TreatmentSchema.omit({
  id: true,
  createdAt: true,
  createdById: true,
}).extend({
  notes: z.string().trim().max(10_000).optional().or(z.literal("")),
});

export const CreateTreatmentSchemaNormalized = CreateTreatmentSchema.transform(
  (data) => ({
    ...data,
    notes:
      data.notes && data.notes.trim().length > 0 ? data.notes.trim() : null,
    title: data.title.trim(),
  }),
);
