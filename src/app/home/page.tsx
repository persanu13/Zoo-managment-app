import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { TaskStatus } from "@/generated/prisma/client";
import { auth } from "@/auth/auth";
import Link from "next/link";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = session.user;

  const now = new Date();
  const sod = startOfDay(now);
  const eod = endOfDay(now);
  const som = startOfMonth(now);
  const eom = endOfMonth(now);

  const EXCLUDED_STATUSES: TaskStatus[] = ["DONE", "CANCELED"];

  const activeTaskWhere = {
    status: { notIn: EXCLUDED_STATUSES },
    assignedToId: user.id,
  };
  const [
    totalActiveTasks,
    urgentTasks,
    dueTodayTasks,
    totalAnimals,
    unhealthyAnimals,
    newAnimalsThisMonth,
    totalHabitats,
    closedHabitats,
    habitatsWithCounts,
  ] = await Promise.all([
    prisma.task.count({ where: activeTaskWhere }),
    prisma.task.count({
      where: { ...activeTaskWhere, priority: "URGENT" },
    }),
    prisma.task.count({
      where: {
        ...activeTaskWhere,
        dueDate: { gte: sod, lte: eod },
      },
    }),

    prisma.animal.count(),
    prisma.animal.count({ where: { healthStatus: "UNHEALTHY" } }),
    prisma.animal.count({
      where: { arrivalDate: { gte: som, lte: eom } },
    }),

    prisma.habitat.count(),
    prisma.habitat.count({ where: { closed: true } }),
    prisma.habitat.findMany({
      select: {
        id: true,
        capacity: true,
        _count: { select: { animals: true } },
      },
    }),
  ]);

  const fullHabitats = habitatsWithCounts.filter(
    (h) => h._count.animals >= h.capacity,
  ).length;

  return (
    <div className="space-y-6 mt-8">
      <div className="grid gap-4 md:grid-cols-3">
        {/* TASKS */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="text-sm text-muted-foreground">Active tasks</div>
              <div className="text-3xl font-semibold">{totalActiveTasks}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">Urgent</div>
                <div className="mt-1 text-xl font-semibold">{urgentTasks}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">Due today</div>
                <div className="mt-1 text-xl font-semibold">
                  {dueTodayTasks}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Link href="/home/tasks">
              <Button variant="outline">Go to Tasks</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* ANIMALS */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Animals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="text-sm text-muted-foreground">Total animals</div>
              <div className="text-3xl font-semibold">{totalAnimals}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">Unhealthy</div>
                <div className="mt-1 text-xl font-semibold">
                  {unhealthyAnimals}
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">
                  New this month
                </div>
                <div className="mt-1 text-xl font-semibold">
                  {newAnimalsThisMonth}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Link href="/home/animals">
              <Button variant="outline">Go to Animals</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* HABITATS */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Habitats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="text-sm text-muted-foreground">
                Total habitats
              </div>
              <div className="text-3xl font-semibold">{totalHabitats}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">Closed</div>
                <div className="mt-1 text-xl font-semibold">
                  {closedHabitats}
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">Full</div>
                <div className="mt-1 text-xl font-semibold">{fullHabitats}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Link href="/home/habitats">
              <Button variant="outline">Go to Habitats</Button>
            </Link>
            <Link href="/home/map">
              <Button>Open Map</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
