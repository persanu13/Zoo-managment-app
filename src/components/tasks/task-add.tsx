"use client";

import { useActionState, useMemo, useState } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ListTodo, TriangleAlert } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DatePicker } from "@/components/ui/date-picker"; // ajustează path-ul tău

import { State } from "@/lib/types";
import { createTask } from "@/lib/actions/tasks";
import { Animal, Habitat, TaskType, User } from "@/generated/prisma/client";

interface TaskCreateFormProps {
  users: User[];
  animals: Animal[];
  habitats: Habitat[];
}

export function TaskAdd({ users, animals, habitats }: TaskCreateFormProps) {
  const initialState: State = { message: null, errors: {} };

  const [state, formAction, isPending] = useActionState(
    createTask,
    initialState,
  );

  const [type, setType] = useState<TaskType>("GENERAL");

  const requiresAnimal = type === "FEEDING" || type === "MEDICAL";
  const requiresHabitat = type === "FEEDING" || type === "CLEANING";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          Add Task
          <ListTodo className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <form action={formAction}>
          <DialogHeader className="border-b bg-background px-6 py-5">
            <DialogTitle className="text-base font-semibold">
              Add task
            </DialogTitle>
            <DialogDescription>
              Create a new task for the zoo staff.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 no-scrollbar  max-h-[50vh] overflow-y-auto ">
            <FieldSet>
              <FieldLegend>Task details</FieldLegend>

              <FieldGroup className="mt-4">
                {/* TITLE */}
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Clean habitat 3 / Feed Leo / Inventory check..."
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
                    {/* Important: pentru control condițional avem state local */}
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
                    <Select name="priority" defaultValue="MEDIUM">
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
                  <DatePicker name="dueDate" />
                  <FieldDescription>Optional deadline</FieldDescription>
                  {state.errors?.dueDate && (
                    <FieldError>{state.errors.dueDate}</FieldError>
                  )}
                </Field>

                {/* ASSIGNED TO */}
                <Field>
                  <FieldLabel htmlFor="assignedToId">Assigned to</FieldLabel>
                  <Select name="assignedToId">
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
                  <FieldDescription>
                    Leave empty if not assigned
                  </FieldDescription>
                  {state.errors?.assignedToId && (
                    <FieldError>{state.errors.assignedToId}</FieldError>
                  )}
                </Field>

                {/* CONDITIONAL: FEEDING -> Animal + Habitat */}
                {requiresAnimal && (
                  <Field>
                    <FieldLabel htmlFor="animalId">Animal</FieldLabel>
                    <Select name="animalId">
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

                {/* CONDITIONAL: FEEDING or CLEANING -> Habitat */}
                {requiresHabitat && (
                  <Field>
                    <FieldLabel htmlFor="habitatId">Habitat</FieldLabel>
                    <Select name="habitatId">
                      <SelectTrigger>
                        <SelectValue placeholder="Select habitat" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 overflow-y-auto">
                        {habitats.map((h) => (
                          <SelectItem key={h.id} value={h.id}>
                            {typeof h.number === "number"
                              ? `${h.number} — `
                              : ""}
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

                {/* eroare generală */}
                {state.message && (
                  <FieldError className="flex items-center gap-2">
                    <TriangleAlert size={16} />
                    {state.message}
                  </FieldError>
                )}
              </FieldGroup>
            </FieldSet>
          </div>

          <DialogFooter className="border-t bg-muted/20 px-6 py-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" aria-disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
