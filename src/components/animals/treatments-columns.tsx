"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Shield,
  SquarePen,
  User,
  Users,
  ChevronUp,
  Trash2Icon,
  ArrowUpDown,
  Mars,
  Venus,
  Circle,
  HelpCircle,
  MoreHorizontal,
  ShieldCheck,
  Activity,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Animal, Treatment } from "@/generated/prisma/client";
import { deleteUser } from "@/lib/actions/users";
import Link from "next/link";
import { TreatmentView } from "./treatment-view";
import { deleteTreatment } from "@/lib/actions/treataments";
import { State } from "@/lib/types";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

type TreatmentWithCreator = Treatment & {
  createdBy: {
    id: string;
    name: string;
  } | null;
};

export const columns: ColumnDef<TreatmentWithCreator>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = String(row.getValue("notes") || "");
      const truncated = notes.length > 30 ? notes.slice(0, 30) + "..." : notes;

      return (
        <span className="max-w-[200px] truncate block" title={notes}>
          {truncated}
        </span>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => {
      const createdByName = row.original.createdBy?.name || "Unknown";
      return <span className="font-medium">{createdByName}</span>;
    },
  },

  {
    id: "date",
    accessorFn: (row) => new Date(row.date).toLocaleDateString("default"),
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="max-w-40"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return (
        <div className="font-mono text-xs  text-muted-foreground max-w-40">
          {date.toLocaleDateString("default", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const initialState: State = { message: null, errors: {} };

      const action = deleteTreatment.bind(null, row.original.id);

      const [state, formAction, isPending] = useActionState(
        action,
        initialState,
      );

      useEffect(() => {
        if (!state) return;

        if (state.message) {
          toast.error(state.message);
          return;
        }
      }, [state]);

      return (
        <div className="flex gap-2 justify-end ">
          <TreatmentView treatment={row.original} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="cursor-pointer size-9"
              >
                <Trash2Icon size="16" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete tratament "{row.original.title}" by{" "}
                  {row.original.createdBy?.name}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form action={formAction}>
                  <AlertDialogAction type="submit" variant="destructive">
                    Delete
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
