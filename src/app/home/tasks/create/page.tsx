import { auth } from "@/auth/auth";
import { TaskForm } from "@/components/tasks/task-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";

export default async function CreateTaskPage() {
  const session = await auth();

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  const animals = await prisma.animal.findMany({
    orderBy: { name: "asc" },
  });

  const habitats = await prisma.habitat.findMany({
    orderBy: { number: "asc" },
  });

  return (
    <div className="container mx-auto flex justify-center mt-8">
      <Card className="w-full h-fit mb-5">
        <CardHeader>
          <CardTitle>Add new Task</CardTitle>
          <CardDescription>
            Add a new task to the zoo management system.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TaskForm users={users} animals={animals} habitats={habitats} />
        </CardContent>
      </Card>
    </div>
  );
}
