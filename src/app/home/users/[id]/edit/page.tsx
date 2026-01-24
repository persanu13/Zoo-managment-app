import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserForm } from "@/components/users/user-form";
import prisma from "@/lib/prisma";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const editedUser = await prisma.user.findUnique({
    where: { id: id },
  });
  1;

  return (
    <div className="container mx-auto  flex justify-center  mt-8">
      <Card className="w-full h-fit mb-5">
        <CardHeader>
          <CardTitle>Edit Employee {editedUser?.name}</CardTitle>
          <CardDescription>
            Add a new employee to the zoo management system.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UserForm initialData={editedUser} mode="edit" />
        </CardContent>
      </Card>
    </div>
  );
}
