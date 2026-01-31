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
import { Input } from "../ui/input";

import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAnimal, updateAnimal } from "@/lib/actions/animals";
import { State } from "@/lib/types";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { HealthStatus, Sex } from "@/generated/prisma/enums";

interface AnimalFormProps {
  initialData?: {
    id: string;
    name: string;
    species: string;
    commonName: string;
    age: number;
    sex: Sex;
    weight?: number | null;
    imageUrl?: string | null;
    healthStatus: HealthStatus;
    habitatId?: string | null;
  } | null;
  mode?: "create" | "edit";
  habitats?: { id: string; name: string }[]; // Pentru dropdown
}

export function AnimalForm({
  initialData,
  mode = "create",
  habitats = [],
}: AnimalFormProps) {
  const isEditMode = mode === "edit";

  const initialState: State = { message: null, errors: {} };

  const action = initialData
    ? updateAnimal.bind(null, initialData.id)
    : createAnimal;

  const [errorMessage, formAction, isPending] = useActionState(
    action,
    initialState,
  );

  return (
    <form action={formAction}>
      <FieldSet>
        <FieldLegend>
          {isEditMode ? "Edit Animal" : "Animal information"}
        </FieldLegend>
        <FieldDescription>
          {isEditMode
            ? "Update animal details and health status."
            : "Fill in the details below to add a new animal to the zoo."}
        </FieldDescription>

        <FieldGroup>
          {/* NAME */}
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Leo"
              defaultValue={initialData?.name || ""}
            />
            {errorMessage.errors?.name && (
              <FieldError>{errorMessage.errors.name}</FieldError>
            )}
          </Field>

          {/* SPECIES & COMMON NAME */}
          <Field orientation="horizontal">
            <Field>
              <FieldLabel htmlFor="species">Scientific name</FieldLabel>
              <Input
                id="species"
                name="species"
                type="text"
                placeholder="Panthera leo"
                defaultValue={initialData?.species || ""}
              />
              {errorMessage.errors?.species && (
                <FieldError>{errorMessage.errors.species}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="commonName">Common name</FieldLabel>
              <Input
                id="commonName"
                name="commonName"
                type="text"
                placeholder="African Lion"
                defaultValue={initialData?.commonName || ""}
              />
              {errorMessage.errors?.commonName && (
                <FieldError>{errorMessage.errors.commonName}</FieldError>
              )}
            </Field>
          </Field>

          {/* AGE & SEX */}
          <Field orientation="horizontal">
            <Field>
              <FieldLabel htmlFor="age">Age (years)</FieldLabel>
              <Input
                id="age"
                name="age"
                type="number"
                min="0"
                max="100"
                placeholder="5"
                defaultValue={initialData?.age || ""}
              />
              {errorMessage.errors?.age && (
                <FieldError>{errorMessage.errors.age}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Sex</FieldLabel>
              <RadioGroup
                name="sex"
                defaultValue={initialData?.sex || "UNKNOWN"}
              >
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Male</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="MALE" id="male" />
                </Field>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Female</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="FEMALE" id="female" />
                </Field>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Unknown</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="UNKNOWN" id="unknown" />
                </Field>
              </RadioGroup>
            </Field>
          </Field>

          {/* WEIGHT - OPȚIONAL */}
          <Field>
            <FieldLabel htmlFor="weight">Weight (kg)</FieldLabel>
            <Input
              id="weight"
              name="weight"
              type="number"
              min="0"
              step="0.1"
              placeholder="150.5"
              defaultValue={initialData?.weight || ""}
            />
            <FieldDescription>Leave empty if unknown</FieldDescription>
            {errorMessage.errors?.weight && (
              <FieldError>{errorMessage.errors.weight}</FieldError>
            )}
          </Field>

          {/* IMAGE URL - OPȚIONAL */}
          <Field>
            <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="text"
              placeholder="https://example.com/lion.jpg"
              defaultValue={initialData?.imageUrl || ""}
            />
            <FieldDescription>Optional profile photo</FieldDescription>
            {errorMessage.errors?.imageUrl && (
              <FieldError>{errorMessage.errors.imageUrl}</FieldError>
            )}
          </Field>

          {/* HEALTH STATUS */}
          <Field>
            <FieldLabel>Health status</FieldLabel>
            <RadioGroup
              name="healthStatus"
              defaultValue={initialData?.healthStatus || "HEALTHY"}
            >
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Healthy</FieldTitle>
                  <FieldDescription>Normal health condition</FieldDescription>
                </FieldContent>
                <RadioGroupItem value="HEALTHY" id="healthy" />
              </Field>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Under observation</FieldTitle>
                  <FieldDescription>
                    Minor issues, monitoring required
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="OBSERVATION" id="observation" />
              </Field>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Unhealthy</FieldTitle>
                  <FieldDescription>
                    Requires veterinary attention
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="UNHEALTHY" id="unhealthy" />
              </Field>
            </RadioGroup>
          </Field>

          {/* HABITAT - OPȚIONAL */}
          <Field>
            <FieldLabel htmlFor="habitatId">Habitat</FieldLabel>
            <Select
              name="habitatId"
              defaultValue={initialData?.habitatId || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select habitat (optional)" />
              </SelectTrigger>
              <SelectContent>
                {habitats.map((habitat) => (
                  <SelectItem key={habitat.id} value={habitat.id}>
                    {habitat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>Leave empty if not assigned</FieldDescription>
            {errorMessage.errors?.habitatId && (
              <FieldError>{errorMessage.errors.habitatId}</FieldError>
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
              {isEditMode ? "Update Animal" : "Create Animal"}
            </Button>
            <Link href="/home/animals">
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
