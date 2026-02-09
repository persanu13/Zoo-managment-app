"use client";

import { useActionState } from "react";
import { ClipboardPlus, TriangleAlert } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea"; // dacă nu ai, îți zic cum

import { State } from "@/lib/types";
import { createTreatment } from "@/lib/actions/treataments";
import { DatePicker } from "../ui/date-picker";

export function TreatamentAdd({ animalId }: { animalId: string }) {
  const initialState: State = { message: null, errors: {} };

  const [state, formAction, isPending] = useActionState(
    createTreatment,
    initialState,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          Add Treatment
          <ClipboardPlus className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <form action={formAction}>
          <DialogHeader className="border-b bg-background px-6 py-5">
            <DialogTitle className="text-base font-semibold">
              Add treatment
            </DialogTitle>
            <DialogDescription>
              Create a new treatment record for this animal.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5">
            <input type="hidden" name="animalId" value={animalId} />

            <FieldSet>
              <FieldLegend>Treatment details</FieldLegend>

              <FieldGroup className="mt-4">
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Deworming / Vaccination / Check-up..."
                  />
                  {state.errors?.title && (
                    <FieldError>{state.errors.title}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="date">Date</FieldLabel>
                  <DatePicker name="date" />
                  <FieldDescription>
                    This is the date the treatment was performed.
                  </FieldDescription>
                  {state.errors?.date && (
                    <FieldError>{state.errors.date}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="notes">Notes</FieldLabel>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Add details: medication, dosage, observations..."
                    className="min-h-[120px] resize-none"
                  />
                  {state.errors?.notes && (
                    <FieldError>{state.errors.notes}</FieldError>
                  )}
                </Field>

                {/* eroare generală (db, auth, etc) */}
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
