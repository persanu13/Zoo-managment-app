import { columns } from "@/components/animals/animals-columns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/layout/data-table";
import prisma from "@/lib/prisma";
import { Turtle } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth/auth";

export default async function AnimalsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = session.user;

  const data = await prisma.animal.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="container mx-auto  flex justify-center  mt-8">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Animal Table</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
          {user.role !== "STAFF" && (
            <Link href="/home/animals/create">
              <Button className="cursor-pointer">
                Add new Animal
                <Turtle className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
