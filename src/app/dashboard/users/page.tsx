import { auth } from "@/auth/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { columns } from "@/components/users/columns";
import { DataTable } from "@/components/users/users-table";
import { User } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { SlashIcon } from "lucide-react";
import { UserForm } from "@/components/users/user-form";

export default async function DemoPage() {
  const data = await prisma.user.findMany();
  const session = await auth();

  return (
    <div className="container mx-auto  flex gap-5 mt-8">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Users Table</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
      <UserForm />
    </div>
  );
}
