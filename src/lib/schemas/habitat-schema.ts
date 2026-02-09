import z from "zod";

// --------------------
// ZOD SCHEMAS
// --------------------

export const HabitatSchema = z.object({
  id: z.string().cuid(),
  number: z.number().int().min(1, "Number must be 1 or more"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  type: z.string().min(2, "Type is required").max(100),
  capacity: z.number().int().min(0, "Capacity must be 0 or more").max(100000),
  coordinates: z.array(z.number().int()), // nu edităm aici
  color: z.string().nullish(),
  closed: z.boolean().default(true),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdateHabitatSchema = HabitatSchema.omit({
  id: true,
  coordinates: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // color: optional + permite "" din form (adică "gol" => null)
  color: z.string().optional().or(z.literal("")).nullable(),
  // closed vine din form ca string, îl parsezi înainte; schema îl vrea boolean
  closed: z.boolean(),
});
