import Map from "@/components/map/map";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";

export default async function MapPage() {
  const habitats = await prisma.habitat.findMany();
  return (
    <div className="flex-1 flex flex-col mt-8 ">
      <Map habitats={habitats} />
    </div>
  );
}
