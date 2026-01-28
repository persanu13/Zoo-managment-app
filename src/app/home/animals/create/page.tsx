import { auth } from "@/auth/auth";
import { AnimalForm } from "@/components/animals/animal-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function CreateAnimalPage() {
  const session = await auth();

  return (
    <div className="container mx-auto  flex justify-center  mt-8">
      <Card className="w-full h-fit mb-5">
        <CardHeader>
          <CardTitle>Add new Animal</CardTitle>
          <CardDescription>Add a new animal to the zoo system.</CardDescription>
        </CardHeader>

        <CardContent>
          <AnimalForm />
        </CardContent>
      </Card>
    </div>
  );
}
