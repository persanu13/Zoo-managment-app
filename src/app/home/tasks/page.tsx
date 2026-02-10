import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/layout/data-table";
import prisma from "@/lib/prisma";
import { auth } from "@/auth/auth";
import { columns } from "@/components/tasks/tasks-columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";

export default async function TasksPage() {
  const session = await auth();
  const user = session?.user;

  const allTasks =
    user?.role === "SUPER_ADMIN"
      ? await prisma.task.findMany({
          orderBy: { updatedAt: "desc" },
          include: {
            createdBy: true,
            assignedTo: true,
            animal: true,
            habitat: true,
            treatment: true,
          },
        })
      : null;

  const createdTasks =
    user?.role !== "STAFF"
      ? await prisma.task.findMany({
          orderBy: { updatedAt: "desc" },
          include: {
            createdBy: true,
            assignedTo: true,
            animal: true,
            habitat: true,
            treatment: true,
          },
          where: {
            createdById: user?.id,
          },
        })
      : null;

  const myTasks = await prisma.task.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      createdBy: true,
      assignedTo: true,
      animal: true,
      habitat: true,
      treatment: true,
    },
    where: {
      assignedToId: user?.id,
    },
  });

  return (
    <div className="container mx-auto  flex flex-col justify-center  mt-8 gap-5">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            {allTasks && (
              <div>
                <h1 className="text-xl font-semibold">All Tasks Table</h1>
                <DataTable columns={columns} data={allTasks} />
              </div>
            )}

            {createdTasks && (
              <div>
                <h1 className="text-xl font-semibold">Created By My</h1>
                <DataTable columns={columns} data={createdTasks} />
                <Link href="/home/tasks/create">
                  <Button className="cursor-pointer">
                    Add Task
                    <ListTodo className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            <div>
              <h1 className="text-xl font-semibold">My Tasks</h1>
              <DataTable columns={columns} data={myTasks} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
