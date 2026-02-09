"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

import { State } from "@/lib/types";
import { createTask, updateTask } from "@/lib/actions/tasks";
import { TaskPriority, TaskType } from "@/generated/prisma/client";

type TaskFormModel = {
  id: string;
  title: string;
  description?: string | null;
  type: TaskType;
  priority: TaskPriority;
  dueDate?: Date | string | null;
  assignedToId?: string | null;
  animalId?: string | null;
  habitatId?: string | null;
  treatmentId?: string | null;
};

interface TaskFormProps {
  initialData?: TaskFormModel | null;
  mode?: "create" | "edit";
  users: { id: string; name: string | null; email: string }[];
  animals: { id: string; name: string; species?: string | null }[];
  habitats: { id: string; name: string; number?: number | null }[];
}

function toISODateOnly(value?: Date | string | null) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  // YYYY-MM-DD (bun pt date inputs / multe date pickers)
  return d.toISOString().slice(0, 10);
}

export function TaskForm({
  initialData,
  mode = "create",
  users,
  animals,
  habitats,
}: TaskFormProps) {
  const isEditMode = mode === "edit";

  const initialState: State = { message: null, errors: {} };

  const action = initialData
    ? updateTask.bind(null, initialData.id)
    : createTask;

  const [state, formAction, isPending] = useActionState(action, initialState);

  // type control (pt conditional fields)
  const [type, setType] = useState<TaskType>(initialData?.type ?? "GENERAL");

  useEffect(() => {
    // dacă se schimbă initialData (navigare edit între item-uri)
    setType(initialData?.type ?? "GENERAL");
  }, [initialData?.type]);

  const requiresAnimal = type === "FEEDING" || type === "MEDICAL";
  const requiresHabitat = type === "FEEDING" || type === "CLEANING";

  // defaults pt edit
  const defaultAssigned = initialData?.assignedToId ?? undefined;
  const defaultAnimal = initialData?.animalId ?? undefined;
  const defaultHabitat = initialData?.habitatId ?? undefined;

  const dueDateDefault = useMemo(
    () => toISODateOnly(initialData?.dueDate),
    [initialData?.dueDate],
  );

  return (
    <form action={formAction}>
      <FieldSet>
        <FieldLegend>{isEditMode ? "Edit Task" : "Create Task"}</FieldLegend>
        <FieldDescription>
          {isEditMode
            ? "Update task details, assignment and deadline."
            : "Fill in the details below to add a new task for the staff."}
        </FieldDescription>

        <FieldGroup className="mt-4">
          {/* TITLE */}
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Clean habitat 3 / Feed Leo / Inventory check..."
              defaultValue={initialData?.title ?? ""}
            />
            {state.errors?.title && (
              <FieldError>{state.errors.title}</FieldError>
            )}
          </Field>

          {/* DESCRIPTION */}
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Details, notes, instructions..."
              className="min-h-[110px] resize-none"
              defaultValue={initialData?.description ?? ""}
            />
            <FieldDescription>Optional</FieldDescription>
            {state.errors?.description && (
              <FieldError>{state.errors.description}</FieldError>
            )}
          </Field>

          {/* TYPE + PRIORITY */}
          <Field orientation="horizontal">
            <Field>
              <FieldLabel>Type</FieldLabel>

              {/* ca să trimiți type-ul real în FormData */}
              <input type="hidden" name="type" value={type} />

              <Select
                value={type}
                onValueChange={(v) => setType(v as TaskType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="FEEDING">Feeding</SelectItem>
                  <SelectItem value="CLEANING">Cleaning</SelectItem>
                  <SelectItem value="MEDICAL">Medical</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="TRANSFER">Transfer</SelectItem>
                  <SelectItem value="INVENTORY">Inventory</SelectItem>
                </SelectContent>
              </Select>

              {state.errors?.type && (
                <FieldError>{state.errors.type}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Priority</FieldLabel>
              <Select
                name="priority"
                defaultValue={initialData?.priority ?? "MEDIUM"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.priority && (
                <FieldError>{state.errors.priority}</FieldError>
              )}
            </Field>
          </Field>

          {/* DUE DATE */}
          <Field>
            <FieldLabel htmlFor="dueDate">Due date</FieldLabel>

            <DatePicker
              name="dueDate"
              defaultValue={dueDateDefault}
              mode="datetime"
            />

            <FieldDescription>Optional deadline</FieldDescription>
            {state.errors?.dueDate && (
              <FieldError>{state.errors.dueDate}</FieldError>
            )}
          </Field>

          {/* ASSIGNED TO */}
          <Field>
            <FieldLabel htmlFor="assignedToId">Assigned to</FieldLabel>
            <Select name="assignedToId" defaultValue={defaultAssigned}>
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-y-auto">
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name ? `${u.name} (${u.email})` : u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>Leave empty if not assigned</FieldDescription>
            {state.errors?.assignedToId && (
              <FieldError>{state.errors.assignedToId}</FieldError>
            )}
          </Field>

          {/* CONDITIONAL: FEEDING/MEDICAL -> Animal */}
          {requiresAnimal && (
            <Field>
              <FieldLabel htmlFor="animalId">Animal</FieldLabel>
              <Select name="animalId" defaultValue={defaultAnimal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select animal" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {animals.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                      {a.species ? ` — ${a.species}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.animalId && (
                <FieldError>{state.errors.animalId}</FieldError>
              )}
            </Field>
          )}

          {/* CONDITIONAL: FEEDING/CLEANING -> Habitat */}
          {requiresHabitat && (
            <Field>
              <FieldLabel htmlFor="habitatId">Habitat</FieldLabel>
              <Select name="habitatId" defaultValue={defaultHabitat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select habitat" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {habitats.map((h) => (
                    <SelectItem key={h.id} value={h.id}>
                      {typeof h.number === "number" ? `${h.number} — ` : ""}
                      {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.habitatId && (
                <FieldError>{state.errors.habitatId}</FieldError>
              )}
            </Field>
          )}

          {/* GENERAL ERROR */}
          {state.message && (
            <FieldError className="flex items-center gap-2">
              <TriangleAlert size={16} />
              {state.message}
            </FieldError>
          )}

          {/* ACTIONS */}
          <Field orientation="horizontal">
            <Button type="submit" aria-disabled={isPending}>
              {isEditMode ? "Update Task" : "Create Task"}
            </Button>

            <Link href="/home/tasks">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
