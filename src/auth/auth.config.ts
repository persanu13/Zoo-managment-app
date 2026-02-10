import { Role } from "@/generated/prisma/enums";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    //  Middleware authorization
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      const pathname = nextUrl.pathname;
      const isOnHome = pathname.startsWith("/home");

      if (pathname === "/") {
        return Response.redirect(
          new URL(isLoggedIn ? "/home" : "/login", nextUrl),
        );
      }

      if (isLoggedIn && pathname === "/login") {
        return Response.redirect(new URL("/home", nextUrl));
      }

      if (isOnHome && !isLoggedIn) return false;

      const isAdminOrSuper = role === "ADMIN" || role === "SUPER_ADMIN";

      const isSuper = role === "SUPER_ADMIN";

      const isCreateOrEditRoute =
        pathname.startsWith("/home/") &&
        (pathname.includes("/create") || pathname.includes("/edit"));

      const isUsersRoute = pathname.startsWith("/home/users");

      if (isUsersRoute && !isAdminOrSuper) {
        return Response.redirect(new URL("/unauthorized", nextUrl));
      }

      if (isUsersRoute && isCreateOrEditRoute && !isSuper) {
        return Response.redirect(new URL("/unauthorized", nextUrl));
      }

      if (isCreateOrEditRoute && !isUsersRoute && !isAdminOrSuper) {
        return Response.redirect(new URL("/unauthorized", nextUrl));
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
