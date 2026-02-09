import { TreatamentAdd } from "@/components/animals/treatment-add";
import { columns } from "@/components/animals/treatments-columns";
import { DataTable } from "@/components/layout/data-table";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { comicRelief, rowdies, tinos } from "@/lib/fonts";
import prisma from "@/lib/prisma";

import {
  Mars,
  Venus,
  HelpCircle,
  HeartPulse,
  Calendar,
  Weight,
  PawPrint,
  Dna,
  Syringe,
} from "lucide-react";

import Image from "next/image";

export default async function AnimalViewPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  const animal = await prisma.animal.findUnique({
    where: { id: id },
    include: {
      treatments: {
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  const SexIcon = ({ sex }: { sex: string }) => {
    if (sex === "MALE") return <Mars className="w-5 h-5 text-blue-600" />;
    if (sex === "FEMALE") return <Venus className="w-5 h-5 text-pink-600" />;
    return <HelpCircle className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="container mx-auto     mt-8">
      <h1 className="text-5xl font-medium my-4 ml-6">Animal Profile</h1>
      <Card className="w-full  mb-5 max-w-240">
        <CardHeader></CardHeader>
        <CardContent>
          <div className="flex w-full  gap-8">
            <div className="flex-1   rounded-md max-w-92">
              <AspectRatio ratio={1 / 1} className="bg-muted rounded-md ">
                <Image
                  src="https://i.ibb.co/nsVSH214/Day-24-Favorite-Parent-Mufasa-Just-his-name-makes-you-shiver.jpg"
                  alt="Photo"
                  fill
                  className=" object-cover rounded-md shadow-[4px_4px_4px_rgba(0,0,0,0.4)]"
                />
              </AspectRatio>
            </div>

            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-semibold">Animal Information</h2>

              <Separator />

              <div className="grid grid-cols-1 gap-4 text-base">
                {/* Name */}
                <div className="flex items-center gap-3">
                  <PawPrint className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">Name:</span>
                  <span>{animal?.name}</span>
                </div>

                {/* Common Name */}
                <div className="flex items-center gap-3">
                  <span className="font-semibold">Common Name:</span>
                  <span>{animal?.commonName}</span>
                </div>

                {/* Species */}
                <div className="flex items-center gap-3">
                  <Dna className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">Species:</span>
                  <span className="italic">{animal?.species}</span>
                </div>

                {/* Age */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">Age:</span>
                  <span>{animal?.age} years</span>
                </div>

                {/* Sex */}
                <div className="flex items-center gap-3">
                  <SexIcon sex={animal?.sex ?? "UNKNOWN"} />
                  <span className="font-semibold">Sex:</span>
                  <span>{animal?.sex}</span>
                </div>

                {/* Weight */}
                {animal?.weight && (
                  <div className="flex items-center gap-3">
                    <Weight className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold">Weight:</span>
                    <span>{animal.weight} kg</span>
                  </div>
                )}

                {/* Health Status */}
                <div className="flex items-center gap-3">
                  <HeartPulse
                    className={`w-5 h-5 ${
                      animal?.healthStatus === "HEALTHY"
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  />
                  <span className="font-semibold">Health Status:</span>
                  <span>{animal?.healthStatus}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex gap-3 items-center">
              <h1 className="font-medium text-2xl">Treatments</h1>
              <Syringe className="h-6 w-6" />
            </div>

            <DataTable data={animal!.treatments} columns={columns} />
            <TreatamentAdd animalId={animal!.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
