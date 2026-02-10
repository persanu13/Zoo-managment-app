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

interface EditTaskPageProps {
  params: { id: string };
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
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

  const taskId = params.id;
  const initialTask = await prisma.task.findFirst({
    where: { id: taskId },
  });

  return (
    <div className="container mx-auto flex justify-center mt-8">
      <Card className="w-full h-fit mb-5">
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
          <CardDescription>
            Update the existing task details in the zoo system.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TaskForm
            mode="edit"
            initialData={initialTask}
            users={users}
            animals={animals}
            habitats={habitats}
          />
        </CardContent>
      </Card>
    </div>
  );
}
