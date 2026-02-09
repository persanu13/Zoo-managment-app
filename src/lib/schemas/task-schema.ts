import { TaskPriority, TaskStatus, TaskType } from "@/generated/prisma/client";
import { z } from "zod";

const taskStatusValues = Object.values(TaskStatus) as [
  TaskStatus,
  ...TaskStatus[],
];

const taskPriorityValues = Object.values(TaskPriority) as [
  TaskPriority,
  ...TaskPriority[],
];

const taskTypeValues = Object.values(TaskType) as [TaskType, ...TaskType[]];

export const TaskStatusEnum = z.enum(taskStatusValues);
export const TaskPriorityEnum = z.enum(taskPriorityValues);
export const TaskTypeEnum = z.enum(taskTypeValues);

export const TaskSchema = z.object({
  id: z.string().cuid(),

  title: z.string().min(2).max(120),
  description: z.string().nullish(),

  type: TaskTypeEnum.default(TaskType.GENERAL),

  status: TaskStatusEnum.default(TaskStatus.TODO),
  priority: TaskPriorityEnum.default(TaskPriority.MEDIUM),

  dueDate: z.date().nullish(),
  startAt: z.date().nullish(),
  completedAt: z.date().nullish(),

  assignedToId: z.string().cuid().nullish(),
  createdById: z.string().cuid(),

  animalId: z.string().cuid().nullish(),
  habitatId: z.string().nullish(),
  treatmentId: z.string().cuid().nullish(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  startAt: true,
  completedAt: true,
})
  .extend({
    description: z.string().optional().or(z.literal("")).nullable(),
    assignedToId: z.string().cuid().optional().or(z.literal("")).nullable(),
    animalId: z.string().cuid().optional().or(z.literal("")).nullable(),
    habitatId: z.string().optional().or(z.literal("")).nullable(),
    treatmentId: z.string().cuid().optional().or(z.literal("")).nullable(),
    dueDate: z.coerce.date().optional().nullable(), // 👈 form-friendly
  })
  .superRefine((data, ctx) => {
    if (data.type === TaskType.FEEDING) {
      if (!data.animalId)
        ctx.addIssue({
          path: ["animalId"],
          message: "Animal is required",
          code: "custom",
        });
      if (!data.habitatId)
        ctx.addIssue({
          path: ["habitatId"],
          message: "Habitat is required",
          code: "custom",
        });
    }

    if (data.type === TaskType.CLEANING && !data.habitatId) {
      ctx.addIssue({
        path: ["habitatId"],
        message: "Habitat is required for cleaning tasks",
        code: "custom",
      });
    }

    if (data.type === TaskType.MEDICAL && !data.animalId) {
      ctx.addIssue({
        path: ["animalId"],
        message: "Animal is required for medical tasks",
        code: "custom",
      });
    }
  });
