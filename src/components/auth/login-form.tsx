"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions/authenticate";
import { useSearchParams } from "next/navigation";

import { ExclamationCircleIcon, KeyIcon } from "@heroicons/react/24/outline";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
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
import { AtSign } from "lucide-react";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <Card className="w-full h-fit max-w-sm mb-5">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Username</FieldLabel>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter username"
                    className="pl-9"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="pl-9"
                  />
                  <KeyIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>
              <Field orientation="horizontal">
                <input type="hidden" name="redirectTo" value={callbackUrl} />
                <Button type="submit">Submit</Button>
              </Field>
              {errorMessage && (
                <>
                  <FieldError className="flex">
                    <ExclamationCircleIcon className="h-5 w-5 mr-1" />
                    {errorMessage}
                  </FieldError>
                </>
              )}
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
