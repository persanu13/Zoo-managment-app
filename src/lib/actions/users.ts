"use server";

import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/user-schema";
import { State } from "../types";
import { redirect } from "next/navigation";
import { hashPassword } from "../auth-utils";
import { auth } from "@/auth/auth";
import { Role } from "@/generated/prisma/enums";

export async function createUser(prevState: State, formData: FormData) {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role !== Role.SUPER_ADMIN) {
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

  revalidatePath("/home/users");
  redirect("/home/users");
}

export async function updateUser(
  userId: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  const user = session?.user;

  // Authorization check
  if (!user || user.role !== Role.SUPER_ADMIN) {
    return {
      errors: {},
      message: "You don't have access to do this function.",
    };
  }

  // Validate userId exists for edit
  if (!userId) {
    return {
      errors: {},
      message: "User ID is required.",
    };
  }

  // Check if change password was requested
  const changePassword = formData.get("changePassword") === "on";

  const validatedFields = UpdateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    ...(changePassword && { password: formData.get("password") }),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Please check your input.",
    };
  }

  const { name, email, role } = validatedFields.data;

  try {
    // Check if email already exists (excluding current user)
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        id: { not: userId },
      },
    });

    if (existingUser) {
      return {
        message: "Update failed!",
        errors: {
          email: ["User with this email already exists!"],
        },
      };
    }

    // Prepare update data
    const updateData: any = {
      name,
      email: email.toLowerCase(),
      role,
    };

    // Add password if requested
    if (changePassword && validatedFields.data.password) {
      updateData.password = await hashPassword(validatedFields.data.password);
    }

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to update user!",
      errors: {
        db: ["An unexpected error occurred. Please try again!"],
      },
    };
  }

  revalidatePath("/home/users");
  redirect("/home/users");
}

export async function deleteUser(userId: string) {
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== Role.SUPER_ADMIN) {
    throw new Error("You don't have access to do this function.");
  }
  await prisma.user.delete({
    where: { id: userId },
  });
  revalidatePath("/home/users");
  return;
}
