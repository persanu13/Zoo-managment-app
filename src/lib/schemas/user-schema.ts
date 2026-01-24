import z from "zod";

export const RoleEnum = z.enum(["STAFF", "ADMIN", "SUPER_ADMIN"]);

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(2, "Name must be at least 2 characters long").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: RoleEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  role: z.enum(["STAFF", "ADMIN"]).default("STAFF"),
});

export const UpdateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .extend({
    role: z.enum(["STAFF", "ADMIN"]),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .optional()
      .or(z.literal("")), // Permite string gol
  })
  .refine(
    (data) => {
      // Password opțional - dacă e furnizat trebuie să fie valid
      if (data.password && data.password.length > 0) {
        return data.password.length >= 8;
      }
      return true;
    },
    {
      message: "Password must be at least 8 characters if provided",
      path: ["password"],
    },
  );
