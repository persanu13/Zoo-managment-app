import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Treatment } from "@/generated/prisma/client";

import { Calendar, SquareChartGantt, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function formatDate(value: Date | string) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("ro-EN", { dateStyle: "long" }).format(d);
}

function authorLabel(createdBy?: TreatmentViewModel["createdBy"]) {
  if (!createdBy) return "—";
  return createdBy.name?.trim() || createdBy.email?.trim() || "—";
}

type TreatmentViewModel = {
  id: string;
  title: string;
  notes?: string | null;
  date: Date | string;
  createdAt: Date | string;
  createdBy?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

export function TreatmentView({
  treatment,
}: {
  treatment: TreatmentViewModel;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="size-9 cursor-pointer">
          <SquareChartGantt size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="border-b bg-background px-6 py-5 shadow-[0px_3px_4px_rgba(0,0,0,0.2)]">
          <DialogTitle className="text-base font-semibold">
            {treatment.title}
          </DialogTitle>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(treatment.date)}</span>
            </span>

            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{authorLabel(treatment.createdBy)}</span>
            </span>
          </div>
        </DialogHeader>
        <Separator orientation="horizontal" className=""></Separator>
        <div className="no-scrollbar  max-h-[50vh] min-h-[50vh] overflow-y-auto px-6 py-5">
          {treatment.notes?.trim() ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {treatment.notes}
            </p>
          ) : (
            <div className="rounded-md border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              Nu există notițe pentru acest tratament.
            </div>
          )}
        </div>
        <DialogFooter className="border-t bg-muted/20 px-6 py-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
