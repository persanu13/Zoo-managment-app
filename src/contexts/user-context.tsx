"use client";

import { Role } from "@/generated/prisma/enums";
import { createContext, useContext } from "react";

export type UserContextType = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: Role;
} | null;

const UserContext = createContext<UserContextType>(null);

export function UserProvider({
  user,
  children,
}: {
  user: UserContextType;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (ctx === undefined) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return ctx;
}
