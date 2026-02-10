"use server";

import { signIn, signOut } from "@/auth/auth";
import { AuthError } from "next-auth";
import { State } from "../types";
import { redirect } from "next/dist/server/api-utils";

export async function authenticate(
  prevState: { error: string } | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
