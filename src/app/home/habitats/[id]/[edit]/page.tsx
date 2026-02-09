import { HabitatForm } from "@/components/habitats/habitat-form";
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
  const habitat = await prisma.habitat.findUnique({
    where: { id: id },
  });
  return (
    <div className="container mx-auto  flex justify-center  mt-8">
      <Card className="w-full h-fit mb-5">
        <CardHeader>
          <CardTitle>
            Edit habitat {habitat?.number}, {habitat?.name}
          </CardTitle>
          <CardDescription>Edit an existing habitat.</CardDescription>
        </CardHeader>

        <CardContent>
          <HabitatForm initialData={habitat!}></HabitatForm>
        </CardContent>
      </Card>
    </div>
  );
}
