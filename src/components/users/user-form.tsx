"use client";

import { useActionState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { createUser, updateUser } from "@/lib/actions/users";
import { State } from "@/lib/types";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Role } from "@/generated/prisma/enums";

interface UserFormProps {
  initialData?: {
    id: string;
    name: string;
    email: string;
    role: Role;
  } | null;
  mode?: "create" | "edit";
}

export function UserForm({ initialData, mode = "create" }: UserFormProps) {
  const isEditMode = mode === "edit";

  const initialState: State = { message: null, errors: {} };

  const action = initialData
    ? updateUser.bind(null, initialData.id)
    : createUser;

  const [errorMessage, formAction, isPending] = useActionState(
    action,
    initialState,
  );

  console.log(initialData);

  return (
    <form action={formAction}>
      <FieldSet>
        <FieldLegend>
          {isEditMode ? "Edit Employee" : "Employee information"}
        </FieldLegend>
        <FieldDescription>
          {isEditMode
            ? "Update employee details. They will be notified of any changes."
            : "Fill in the details below to create a new user account."}
        </FieldDescription>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Max Leiter"
              defaultValue={initialData?.name || ""}
            />
            {errorMessage.errors?.name && (
              <FieldError>{errorMessage.errors.name}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="max.leiter@zoo.com"
              defaultValue={initialData?.email || ""}
            />
            {errorMessage.errors?.email && (
              <FieldError>{errorMessage.errors.email}</FieldError>
            )}
          </Field>

          {/* PASSWORD FIELD - CONDITIONAL IN EDIT MODE */}
          {!isEditMode ? (
            <Field>
              <FieldLabel htmlFor="password">Temporary password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
              />
              <FieldDescription>
                The employee can change this password after the first login.
              </FieldDescription>
              {errorMessage.errors?.password && (
                <FieldError>{errorMessage.errors.password}</FieldError>
              )}
            </Field>
          ) : (
            <Field>
              <div className="flex items-center space-x-2">
                <Checkbox id="change-password" name="changePassword" />
                <FieldLabel htmlFor="change-password">
                  Change password
                </FieldLabel>
              </div>
              <FieldDescription>
                Check this box if you want to set a new password for this
                employee.
              </FieldDescription>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="mt-2"
              />
              {errorMessage.errors?.password && (
                <FieldError>{errorMessage.errors.password}</FieldError>
              )}
            </Field>
          )}

          {/* ROLE SELECTION */}
          <FieldSet>
            <FieldLegend>Employee role</FieldLegend>
            <FieldDescription>
              Select the role that defines what the employee can access in the
              system.
            </FieldDescription>

            <RadioGroup name="role" defaultValue={initialData?.role || "STAFF"}>
              <FieldLabel htmlFor="staff-role">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Staff</FieldTitle>
                    <FieldDescription>
                      Can view animals, enclosures and daily tasks, but cannot
                      manage users or system settings.
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="STAFF" id="staff-role" />
                </Field>
              </FieldLabel>

              <FieldLabel htmlFor="admin-role">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Administrator</FieldTitle>
                    <FieldDescription>
                      Has full access to manage animals, employees and internal
                      data.
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="ADMIN" id="admin-role" />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>

          {errorMessage.message && (
            <FieldError className="flex items-center gap-2">
              <TriangleAlert size={16} />
              {errorMessage.message}
            </FieldError>
          )}

          <Field orientation="horizontal">
            <Button type="submit" aria-disabled={isPending}>
              {isEditMode ? "Update Account" : "Create Account"}
            </Button>
            <Link href="/home/users">
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
