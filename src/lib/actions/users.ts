"use server";

import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { CreateUserSchema } from "../schemas/user-schema";
import { State } from "../types";
import { redirect } from "next/navigation";
import { hashPassword } from "../auth-utils";
import { auth } from "@/auth/auth";
import { Role } from "@/generated/prisma/enums";

export async function createUser(prevState: State, formData: FormData) {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role === Role.STAFF) {
    return {
      errors: {},
      message: "You don't have acces to do this function.",
    };
  }

  const validatedFields = CreateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Employee Account.",
    };
  }

  const { name, email, password, role } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return {
        message: "Registration failed!",
        errors: {
          email: ["User with this email already exists!"],
        },
      };
    }
    const hashedPassword = await hashPassword(password);
    await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role,
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to register user!",
      errors: {
        db: ["An unexpected error occurred. Please try again!"],
      },
    };
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}
