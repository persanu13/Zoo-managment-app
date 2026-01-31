import { auth } from "@/auth/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

import { columns } from "@/components/users/users-columns";
import { DataTable } from "@/components/layout/data-table";
import prisma from "@/lib/prisma";
import { UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function UsersPage() {
  const data = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });
  const session = await auth();

  return (
    <div className="container mx-auto  flex justify-center  mt-8">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Users Table</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
          <Link href="/home/users/create">
            <Button className="cursor-pointer">
              Create New User
              <UserRoundPlus className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
