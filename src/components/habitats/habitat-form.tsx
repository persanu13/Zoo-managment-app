"use client";

import { useActionState } from "react";
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
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

import { State } from "@/lib/types";
import { updateHabitat } from "@/lib/actions/habitats";

interface HabitatFormProps {
  initialData: {
    id: string;
    number: number;
    name: string;
    type: string;
    capacity: number;
    color?: string | null;
    closed: boolean;
  };
}

export function HabitatForm({ initialData }: HabitatFormProps) {
  const initialState: State = { message: null, errors: {} };

  const action = updateHabitat.bind(null, initialData.id);

  const [errorMessage, formAction, isPending] = useActionState(
    action,
    initialState,
  );

  return (
    <form action={formAction}>
      <FieldSet>
        <FieldLegend>Edit Habitat</FieldLegend>
        <FieldDescription>Update habitat details.</FieldDescription>

        <FieldGroup>
          {/* NUMBER */}
          <Field>
            <FieldLabel htmlFor="number">Number</FieldLabel>
            <Input
              id="number"
              name="number"
              type="number"
              min="1"
              step="1"
              placeholder="101"
              defaultValue={initialData.number}
            />
            {errorMessage.errors?.number && (
              <FieldError>{errorMessage.errors.number}</FieldError>
            )}
          </Field>

          {/* NAME */}
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Savannah Enclosure"
              defaultValue={initialData.name}
            />
            {errorMessage.errors?.name && (
              <FieldError>{errorMessage.errors.name}</FieldError>
            )}
          </Field>

          {/* TYPE */}
          <Field>
            <FieldLabel htmlFor="type">Type</FieldLabel>
            <Input
              id="type"
              name="type"
              type="text"
              placeholder="Outdoor"
              defaultValue={initialData.type}
            />
            <FieldDescription>
              Example: Outdoor, Indoor, Aviary, Aquarium
            </FieldDescription>
            {errorMessage.errors?.type && (
              <FieldError>{errorMessage.errors.type}</FieldError>
            )}
          </Field>

          {/* CAPACITY */}
          <Field>
            <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="0"
              step="1"
              placeholder="8"
              defaultValue={initialData.capacity}
            />
            {errorMessage.errors?.capacity && (
              <FieldError>{errorMessage.errors.capacity}</FieldError>
            )}
          </Field>

          {/* COLOR (optional) */}
          <Field>
            <FieldLabel htmlFor="color">Color</FieldLabel>
            <Input
              id="color"
              name="color"
              type="text"
              placeholder="#2D6A4F"
              defaultValue={initialData.color ?? ""}
            />
            <FieldDescription>
              Optional. Hex recommended (e.g. #22C55E)
            </FieldDescription>
            {errorMessage.errors?.color && (
              <FieldError>{errorMessage.errors.color}</FieldError>
            )}
          </Field>

          {/* CLOSED */}
          <Field>
            <FieldLabel>Closed polygon</FieldLabel>
            <RadioGroup
              name="closed"
              defaultValue={initialData.closed ? "true" : "false"}
            >
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Closed</FieldTitle>
                  <FieldDescription>
                    Polygon is closed (default)
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="true" id="closed-true" />
              </Field>

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Open</FieldTitle>
                  <FieldDescription>Polyline (not closed)</FieldDescription>
                </FieldContent>
                <RadioGroupItem value="false" id="closed-false" />
              </Field>
            </RadioGroup>

            {errorMessage.errors?.closed && (
              <FieldError>{errorMessage.errors.closed}</FieldError>
            )}
          </Field>

          {errorMessage.message && (
            <FieldError className="flex items-center gap-2">
              <TriangleAlert size={16} />
              {errorMessage.message}
            </FieldError>
          )}

          <Field orientation="horizontal">
            <Button type="submit" aria-disabled={isPending}>
              Update Habitat
            </Button>

            <Link href="/home/habitats">
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
