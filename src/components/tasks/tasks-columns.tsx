"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  Circle,
  PlayCircle,
  Ban,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronsUp,
  ChevronUp,
  ChevronDown,
  ListTodo,
  Utensils,
  SprayCan,
  Stethoscope,
  Wrench,
  Truck,
  Package,
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
} from "@/components/ui/alert-dialog";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Task,
  TaskPriority,
  TaskStatus,
  TaskType,
} from "@/generated/prisma/client";
import { deleteTask, updateTaskStatus } from "@/lib/actions/tasks";
import { useUser } from "@/contexts/user-context";
import { TaskView } from "./task-view";
import { toast } from "sonner";

// Dacă tu ai deja Task cu relații (assignedTo/animal/habitat), înlocuiește type-ul de mai jos
// cu tipul real pe care îl folosești în tabel.
type TaskRow = Task & {
  assignedTo?: { id: string; name: string | null; email: string } | null;
  animal?: { id: string; name: string } | null;
  habitat?: { id: string; name: string; number?: number | null } | null;
};

function statusMeta(status: TaskStatus) {
  switch (status) {
    case "TODO":
      return {
        Icon: Circle,
        label: "TODO",
        className: "text-muted-foreground",
      };
    case "IN_PROGRESS":
      return {
        Icon: PlayCircle,
        label: "IN PROGRESS",
        className: "text-blue-600",
      };
    case "BLOCKED":
      return { Icon: Ban, label: "BLOCKED", className: "text-amber-600" };
    case "DONE":
      return { Icon: CheckCircle2, label: "DONE", className: "text-green-600" };
    case "CANCELED":
      return { Icon: XCircle, label: "CANCELED", className: "text-red-600" };
    default:
      return {
        Icon: Circle,
        label: String(status),
        className: "text-muted-foreground",
      };
  }
}

function priorityMeta(priority: TaskPriority) {
  switch (priority) {
    case "LOW":
      return {
        Icon: ChevronDown,
        label: "LOW",
        className: "text-muted-foreground",
      };
    case "MEDIUM":
      return { Icon: ChevronUp, label: "MEDIUM", className: "text-blue-600" };
    case "HIGH":
      return { Icon: ChevronsUp, label: "HIGH", className: "text-amber-600" };
    case "URGENT":
      return {
        Icon: AlertTriangle,
        label: "URGENT",
        className: "text-red-600",
      };
    default:
      return {
        Icon: ChevronUp,
        label: String(priority),
        className: "text-muted-foreground",
      };
  }
}

function typeMeta(type: TaskType) {
  switch (type) {
    case "GENERAL":
      return { Icon: ListTodo, label: "GENERAL" };
    case "FEEDING":
      return { Icon: Utensils, label: "FEEDING" };
    case "CLEANING":
      return { Icon: SprayCan, label: "CLEANING" };
    case "MEDICAL":
      return { Icon: Stethoscope, label: "MEDICAL" };
    case "MAINTENANCE":
      return { Icon: Wrench, label: "MAINTENANCE" };
    case "TRANSFER":
      return { Icon: Truck, label: "TRANSFER" };
    case "INVENTORY":
      return { Icon: Package, label: "INVENTORY" };
    default:
      return { Icon: ListTodo, label: String(type) };
  }
}

export const columns: ColumnDef<TaskRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title") as string}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const t = row.getValue("type") as TaskType;
      const { Icon, label } = typeMeta(t);
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    filterFn: (row, id, value) => {
      if (!value) return true;
      return row.getValue(id) === value;
    },
    header: ({ column }) => (
      <div className="flex items-center justify-between w-full h-8 px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
              Status
              <ChevronUp />
              <span className="sr-only">Filter status</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => column.setFilterValue("")}
              className="cursor-pointer"
            >
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("TODO")}
              className="cursor-pointer"
            >
              TODO
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("IN_PROGRESS")}
              className="cursor-pointer"
            >
              In progress
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("BLOCKED")}
              className="cursor-pointer"
            >
              Blocked
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("DONE")}
              className="cursor-pointer"
            >
              Done
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("CANCELED")}
              className="cursor-pointer"
            >
              Canceled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    cell: ({ row }) => {
      const user = useUser();

      const s = row.getValue("status") as TaskStatus;
      const { Icon, label, className } = statusMeta(s);

      const isMine = !!user?.id && row.original.assignedToId === user.id;

      const setStatus = async (next: TaskStatus) => {
        try {
          await updateTaskStatus(row.original.id, next);
          toast?.success?.("Status updated");
        } catch (e: any) {
          toast?.error?.(e?.message ?? "Failed to update status");
        }
      };

      if (!isMine) {
        return (
          <div className="flex items-center gap-2 opacity-70">
            <Icon className={`h-4 w-4 ${className}`} />
            <span className="font-medium">{label}</span>
          </div>
        );
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/50"
              onClick={(e) => e.stopPropagation()}
              title="Click to change status"
            >
              <Icon className={`h-4 w-4 ${className}`} />
              <span className="font-medium">{label}</span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setStatus("TODO")}>
              TODO
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("IN_PROGRESS")}>
              In progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("BLOCKED")}>
              Blocked
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("DONE")}>
              Done
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("CANCELED")}>
              Canceled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "priority",
    filterFn: (row, id, value) => {
      if (!value) return true;
      return row.getValue(id) === value;
    },
    header: ({ column }) => (
      <div className="flex items-center justify-between w-full h-8 px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
              Priority
              <ChevronUp />
              <span className="sr-only">Filter priority</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => column.setFilterValue("")}
              className="cursor-pointer"
            >
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("LOW")}
              className="cursor-pointer"
            >
              Low
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("MEDIUM")}
              className="cursor-pointer"
            >
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("HIGH")}
              className="cursor-pointer"
            >
              High
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("URGENT")}
              className="cursor-pointer"
            >
              Urgent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    cell: ({ row }) => {
      const p = row.getValue("priority") as TaskPriority;
      const { Icon, label, className } = priorityMeta(p);
      return (
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${className}`} />
          <span className="font-medium">{label}</span>
        </div>
      );
    },
  },

  // Assigned to (optional)
  {
    id: "assignedTo",
    header: "Assigned to",
    cell: ({ row }) => {
      const u = row.original.assignedTo;
      if (!u) return <span className="text-muted-foreground">Unassigned</span>;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{u.name ?? u.email}</span>
          <span className="text-xs text-muted-foreground">{u.email}</span>
        </div>
      );
    },
  },

  // Due date
  {
    id: "dueDate",
    accessorFn: (row) => (row.dueDate ? new Date(row.dueDate).getTime() : null),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Due date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const due = row.original.dueDate ? new Date(row.original.dueDate) : null;
      return (
        <div className="font-mono text-xs text-muted-foreground px-4">
          {due
            ? due.toLocaleDateString("default", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "—"}
        </div>
      );
    },
    sortingFn: (a, b) => {
      const av = a.original.dueDate
        ? new Date(a.original.dueDate).getTime()
        : -Infinity;
      const bv = b.original.dueDate
        ? new Date(b.original.dueDate).getTime()
        : -Infinity;
      return av - bv;
    },
  },

  // Actions
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const router = useRouter();
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [showViewDialog, setShowViewDialog] = useState(false);
      const user = useUser();

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
                  View details
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/home/tasks/${row.original.id}/edit`)
                  }
                >
                  Edit
                </DropdownMenuItem>

                {user?.role !== "STAFF" && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete task "{row.original.title}"
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form
                  action={deleteTask.bind(null, row.original.id)}
                  onSubmit={() => setShowDeleteDialog(false)}
                >
                  <AlertDialogAction type="submit" variant="destructive">
                    Delete
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <TaskView
            task={row.original}
            open={showViewDialog}
            onOpenChange={setShowViewDialog}
          />
        </>
      );
    },
  },
];
