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

import { createUser } from "@/lib/actions/users";
import { State } from "@/lib/types";

export function UserForm() {
  const initialState: State = { message: null, errors: {} };
  const [errorMessage, formAction, isPending] = useActionState(
    createUser,
    initialState,
  );

  return (
    <Card className="w-full h-fit mb-5">
      <CardHeader>
        <CardTitle>Create Employee Account</CardTitle>
        <CardDescription>
          Add a new employee to the zoo management system.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction}>
          <FieldSet>
            <FieldLegend>Employee information</FieldLegend>
            <FieldDescription>
              Fill in the details below to create a new user account. The
              employee will be able to log in and access the system based on
              their assigned role.
            </FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Max Leiter"
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
                />
                {errorMessage.errors?.email && (
                  <FieldError>{errorMessage.errors.email}</FieldError>
                )}
              </Field>

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

              {/* ROLE SELECTION */}
              <FieldSet>
                <FieldLegend>Employee role</FieldLegend>
                <FieldDescription>
                  Select the role that defines what the employee can access in
                  the system.
                </FieldDescription>

                <RadioGroup name="role" defaultValue="STAFF">
                  <FieldLabel htmlFor="staff-role">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>Staff</FieldTitle>
                        <FieldDescription>
                          Can view animals, enclosures and daily tasks, but
                          cannot manage users or system settings.
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
                          Has full access to manage animals, employees and
                          internal data.
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value="ADMIN" id="admin-role" />
                    </Field>
                  </FieldLabel>
                </RadioGroup>
              </FieldSet>
              {errorMessage.message && (
                <FieldError className="flex">
                  <ExclamationCircleIcon className="h-5 w-5 mr-1" />
                  {errorMessage.message}
                </FieldError>
              )}
              <Field orientation="horizontal">
                <Button type="submit" aria-disabled={isPending}>
                  Create Account
                </Button>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
