import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/layout/data-table";
import prisma from "@/lib/prisma";
import { Turtle } from "lucide-react";
import Link from "next/link";
import { columns } from "@/components/habitats/habitats-columns";

export default async function HabitatsPage() {
  const data = await prisma.habitat.findMany({
    select: {
      id: true,
      number: true,
      name: true,
      type: true,
      capacity: true,
      closed: true,
      updatedAt: true,
      _count: { select: { animals: true } },
    },
    orderBy: {
      number: "asc",
    },
  });

  return (
    <div className="container mx-auto  flex justify-center  mt-8">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Habitats Table</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
