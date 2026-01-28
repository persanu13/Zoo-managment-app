import z from "zod";

export const SexEnum = z.enum(["MALE", "FEMALE", "UNKNOWN"]);
export const HealthStatusEnum = z.enum(["HEALTHY", "OBSERVATION", "UNHEALTHY"]);

export const AnimalSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  species: z.string().min(2, "Scientific name required").max(200),
  commonName: z.string().min(2, "Common name required").max(100),
  age: z.number().int().min(0, "Age must be 0 or more").max(100),
  sex: SexEnum,
  weight: z.number().min(0, "Weight must be positive").nullable().optional(),
  imageUrl: z.string().url("Invalid URL").optional(),
  healthStatus: HealthStatusEnum,
  habitatId: z.string().cuid().optional(),
  arrivalDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateAnimalSchema = AnimalSchema.omit({
  id: true,
  arrivalDate: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  healthStatus: HealthStatusEnum.default("HEALTHY"),
  sex: SexEnum.default("UNKNOWN"),
});

export const UpdateAnimalSchema = AnimalSchema.omit({
  id: true,
  arrivalDate: true,
  createdAt: true,
  updatedAt: true,
})
  .extend({
    habitatId: z.string().cuid().optional(),
    imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    weight: z
      .number()
      .min(0, "Weight must be positive")
      .optional()
      .or(z.null()),
  })
  .refine(
    (data) => {
      if (data.imageUrl && data.imageUrl.length > 0) {
        return z.string().url().safeParse(data.imageUrl).success;
      }
      return true;
    },
    {
      message: "Image URL must be valid if provided",
      path: ["imageUrl"],
    },
  );
