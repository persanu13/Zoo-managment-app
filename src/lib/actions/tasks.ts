"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../prisma";
import { CreateTaskSchema } from "../schemas/task-schema";
import { TaskPriority, TaskStatus, TaskType } from "@/generated/prisma/client";
import { auth } from "@/auth/auth";
import { State } from "../types";
import { parseDateOnly } from "../utils";

export async function createTask(prevState: State, formData: FormData) {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role == "STAFF") {
    return {
      errors: {},
      message: "You must be logged in a admin account.",
    };
  }

  console.log(formData.get("dueDate"));

  const validatedFields = CreateTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",

    type: formData.get("type") ?? TaskType.GENERAL,
    priority: formData.get("priority") ?? TaskPriority.MEDIUM,

    dueDate: formData.get("dueDate"),

    assignedToId: formData.get("assignedToId"),
    animalId: formData.get("animalId") ?? "",
    habitatId: formData.get("habitatId") ?? "",
    treatmentId: formData.get("treatmentId") ?? "",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Task.",
    };
  }

  const {
    title,
    description,
    type,
    priority,
    dueDate,
    assignedToId,
    animalId,
    habitatId,
    treatmentId,
  } = validatedFields.data;

  try {
    await prisma.task.create({
      data: {
        title,
        description,
        type,
        priority,

        dueDate: dueDate ?? null,

        assignedToId:
          assignedToId && assignedToId.length > 0 ? assignedToId : null,

        animalId: animalId && animalId.length > 0 ? animalId : null,
        habitatId: habitatId && habitatId.length > 0 ? habitatId : null,
        treatmentId: treatmentId && treatmentId.length > 0 ? treatmentId : null,

        createdById: user.id,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to create task!",
      errors: {
        db: ["An unexpected error occurred. Please try again!"],
      },
    };
  }

  revalidatePath("/home/tasks");
  redirect("/home/tasks");
}

export async function updateTask(
  taskId: string,
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

  if (!taskId) {
    return {
      errors: {},
      message: "Task ID is required.",
    };
  }

  // folosim aceeași schemă ca la create (merge ok și pentru update)
  // dacă vrei, poți face separat UpdateTaskSchema
  const validatedFields = CreateTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",

    type: formData.get("type") ?? TaskType.GENERAL,
    priority: formData.get("priority") ?? TaskPriority.MEDIUM,

    dueDate: parseDateOnly(formData.get("dueDate")),

    assignedToId: formData.get("assignedToId"),
    animalId: formData.get("animalId") ?? "",
    habitatId: formData.get("habitatId") ?? "",
    treatmentId: formData.get("treatmentId") ?? "",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Failed to Update Task.",
    };
  }

  const {
    title,
    description,
    type,
    priority,
    dueDate,
    assignedToId,
    animalId,
    habitatId,
    treatmentId,
  } = validatedFields.data;

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        type,
        priority,

        dueDate: dueDate ?? null,

        assignedToId:
          assignedToId && assignedToId.length > 0 ? assignedToId : null,

        animalId: animalId && animalId.length > 0 ? animalId : null,
        habitatId: habitatId && habitatId.length > 0 ? habitatId : null,
        treatmentId: treatmentId && treatmentId.length > 0 ? treatmentId : null,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to update task!",
      errors: {
        db: ["An unexpected error occurred. Please try again!"],
      },
    };
  }

  revalidatePath("/home/tasks");
  redirect("/home/tasks");
}

export async function deleteTask(taskId: string): Promise<void> {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role === "STAFF") {
    // la server action nu “return state”; aruncă eroare sau redirect
    throw new Error("Unauthorized");
  }

  if (!taskId) {
    throw new Error("Task ID is required.");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidatePath("/home/tasks");
  redirect("/home/tasks");
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<void> {
  const session = await auth();
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");
  if (!taskId) throw new Error("Task ID is required");

  // ia task-ul ca să verifici assignment
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { assignedToId: true },
  });

  if (!task) throw new Error("Task not found");

  // ✅ doar assigned user poate schimba status
  if (task.assignedToId !== user.id) throw new Error("Forbidden");

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status,
      // opțional: auto set start/completed timestamps
      startAt: status === "IN_PROGRESS" ? new Date() : undefined,
      completedAt:
        status === "DONE" ? new Date() : status === "TODO" ? null : undefined,
    },
  });

  revalidatePath("/home/tasks");
}
