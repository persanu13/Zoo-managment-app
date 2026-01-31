"use server";

import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import {
  CreateAnimalSchema,
  UpdateAnimalSchema,
} from "../schemas/animal-schema";
import { State } from "../types";
import { redirect } from "next/navigation";
import { auth } from "@/auth/auth";
import { Role, HealthStatus } from "@/generated/prisma/enums";

export async function createAnimal(prevState: State, formData: FormData) {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role == "STAFF") {
    return {
      errors: {},
      message: "You must be logged in a admin account.",
    };
  }

  const validatedFields = CreateAnimalSchema.safeParse({
    name: formData.get("name"),
    species: formData.get("species"),
    commonName: formData.get("commonName"),
    age: formData.get("age") ? Number(formData.get("age")) : null,
    sex: formData.get("sex"),
    healthStatus: formData.get("healthStatus"),
    weight: formData.get("weight") ? Number(formData.get("weight")) : null,
    imageUrl: formData.get("imageUrl") || null,
    habitatId: formData.get("habitatId") || null,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Animal.",
    };
  }

  const {
    name,
    species,
    commonName,
    age,
    sex,
    healthStatus,
    weight,
    imageUrl,
    habitatId,
  } = validatedFields.data;

  try {
    const existingAnimal = await prisma.animal.findFirst({
      where: {
        name,
        species,
      },
    });

    if (existingAnimal) {
      return {
        message: "Animal already exists!",
        errors: {
          name: ["Animal with this name and species already exists!"],
        },
      };
    }

    await prisma.animal.create({
      data: {
        name,
        species,
        commonName,
        age,
        sex,
        healthStatus,
        weight,
        imageUrl,
        habitatId: habitatId || null,
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to create animal!",
      errors: {
        db: ["An unexpected error occurred. Please try again!"],
      },
    };
  }
  revalidatePath("/home/animals");
  redirect("/home/animals");
}

export async function updateAnimal(
  animalId: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role == "STAFF") {
    return {
      errors: {},
      message: "You must be logged in a admin account.",
    };
  }

  if (!animalId) {
    return {
      errors: {},
      message: "Animal ID is required.",
    };
  }

  const validatedFields = CreateAnimalSchema.safeParse({
    name: formData.get("name"),
    species: formData.get("species"),
    commonName: formData.get("commonName"),
    age: formData.get("age") ? Number(formData.get("age")) : null,
    sex: formData.get("sex"),
    healthStatus: formData.get("healthStatus"),
    weight: formData.get("weight") ? Number(formData.get("weight")) : null,
    imageUrl: formData.get("imageUrl") || null,
    habitatId: formData.get("habitatId") || null,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Please check your input.",
    };
  }

  const {
    name,
    species,
    commonName,
    age,
    sex,
    healthStatus,
    weight,
    imageUrl,
    habitatId,
  } = validatedFields.data;

  try {
    const existingAnimal = await prisma.animal.findFirst({
      where: {
        name,
        species,
        id: { not: animalId },
      },
    });
    if (existingAnimal) {
      return {
        message: "Update failed!",
        errors: {
          name: ["Another animal with this name and species already exists!"],
        },
      };
    }

    await prisma.animal.update({
      where: { id: animalId },
      data: {
        name,
        species,
        commonName,
        age,
        sex,
        healthStatus,
        weight,
        imageUrl,
        habitatId: habitatId || null,
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to update animal!",
      errors: {
        db: ["An unexpected error occurred. Please try again!"],
      },
    };
  }

  revalidatePath("/home/animals");
  redirect("/home/animals");
}

export async function deleteAnimal(animalId: string) {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role === Role.STAFF) {
    throw new Error("You don't have access to delete animals.");
  }

  await prisma.animal.delete({
    where: { id: animalId },
  });

  revalidatePath("/home/animals");
}
