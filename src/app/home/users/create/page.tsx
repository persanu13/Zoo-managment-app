import { auth } from "@/auth/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { columns } from "@/components/users/users-columns";
import { DataTable } from "@/components/users/users-table";
import { User } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { SlashIcon, UserIcon, UserRoundPlus } from "lucide-react";
import { UserForm } from "@/components/users/user-form";
import { Button } from "@/components/ui/button";

export default async function DemoPage() {
  const data = await prisma.user.findMany();
  const session = await auth();

  return (
    <div className="container mx-auto  flex justify-center  mt-8">
      <Card className="w-full h-fit mb-5">
        <CardHeader>
          <CardTitle>Create Employee Account</CardTitle>
          <CardDescription>
            Add a new employee to the zoo management system.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
    </div>
  );
}
