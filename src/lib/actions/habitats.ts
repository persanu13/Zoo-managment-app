"use server";

import { auth } from "@/auth/auth";
import { State } from "../types";
import { UpdateHabitatSchema } from "../schemas/habitat-schema";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateHabitat(
  habitatId: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role === "STAFF") {
    return {
      errors: {},
      message: "You must be logged in a admin account.",
    };
  }

  if (!habitatId) {
    return {
      errors: {},
      message: "Habitat ID is required.",
    };
  }

  // parse closed: RadioGroup trimite "true"/"false"
  const closedRaw = formData.get("closed");
  const closed =
    closedRaw === "true" ? true : closedRaw === "false" ? false : undefined;

  const validatedFields = UpdateHabitatSchema.safeParse({
    number: formData.get("number") ? Number(formData.get("number")) : null,
    name: formData.get("name"),
    type: formData.get("type"),
    capacity: formData.get("capacity")
      ? Number(formData.get("capacity"))
      : null,
    color: formData.get("color") ?? "",
    closed,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Please check your input.",
    };
  }

  const {
    number,
    name,
    type,
    capacity,
    color,
    closed: isClosed,
  } = validatedFields.data;

  try {
    // number e @unique — verifică să nu existe alt habitat cu același number
    const existingHabitat = await prisma.habitat.findFirst({
      where: {
        number,
        id: { not: habitatId },
      },
      select: { id: true },
    });

    if (existingHabitat) {
      return {
        message: "Update failed!",
        errors: {
          number: ["Another habitat with this number already exists!"],
        },
      };
    }

    await prisma.habitat.update({
      where: { id: habitatId },
      data: {
        number,
        name,
        type,
        capacity,
        color: color && color.length > 0 ? color : null,
        closed: isClosed,
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to update habitat!",
      errors: {
        db: ["An unexpected error occurred. Please try again!"],
      },
    };
  }

  revalidatePath("/home/habitats");
  redirect("/home/habitats");
}
