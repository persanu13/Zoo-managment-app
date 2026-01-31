import { AnimalForm } from "@/components/animals/animal-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";

export default async function EditAnimalPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  const animal = await prisma.animal.findUnique({
    where: { id: id },
  });
  return (
    <div className="container mx-auto  flex justify-center  mt-8">
      <Card className="w-full h-fit mb-5">
        <CardHeader>
          <CardTitle>Edit animal {animal?.name}</CardTitle>
          <CardDescription>Edit an existing animal.</CardDescription>
        </CardHeader>

        <CardContent>
          <AnimalForm initialData={animal} mode="edit" />
        </CardContent>
      </Card>
    </div>
  );
}
