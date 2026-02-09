"use server";

import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth/auth";
import { Role } from "@/generated/prisma/enums";

import { State } from "../types";
import { CreateTreatmentSchema } from "../schemas/treataments";
import { parseDateOnly } from "../utils";

export async function createTreatment(prevState: State, formData: FormData) {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role === Role.STAFF) {
    return {
      errors: {},
      message: "You must be logged in with an admin account.",
    };
  }

  const validatedFields = CreateTreatmentSchema.safeParse({
    animalId: formData.get("animalId"),
    title: formData.get("title"),
    notes: formData.get("notes") ?? "",
    date: parseDateOnly(formData.get("date")),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing/invalid fields. Failed to create treatment.",
    };
  }

  const { animalId, title, notes, date } = validatedFields.data;

  try {
    const animalExists = await prisma.animal.findUnique({
      where: { id: animalId },
      select: { id: true },
    });

    if (!animalExists) {
      return {
        message: "Animal not found.",
        errors: { animalId: ["Animal does not exist."] },
      };
    }
    console.log(animalId, title, notes, date, user.id);

    await prisma.treatment.create({
      data: {
        animalId,
        title,
        notes,
        date,
        createdById: user.id,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to create treatment!",
      errors: { db: ["An unexpected error occurred. Please try again!"] },
    };
  }

  revalidatePath(`/home/animals/${animalId}`);
  redirect(`/home/animals/${animalId}`);
}
export async function deleteTreatment(
  treatmentId: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role === Role.STAFF) {
    return {
      errors: {},
      message: "You don't have access to delete treatments.",
    };
  }

  const existing = await prisma.treatment.findUnique({
    where: { id: treatmentId },
    select: { id: true, animalId: true, createdById: true },
  });

  if (!existing) {
    return {
      errors: {},
      message: "Treatment not found.",
    };
  }

  if (existing.createdById !== user.id) {
    return {
      errors: {},
      message: "You can only delete your own treatments.",
    };
  }

  await prisma.treatment.delete({
    where: { id: treatmentId },
  });

  revalidatePath(`/home/animals/${existing.animalId}`);

  return { errors: {}, message: null };
}
