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

import { Animal } from "@/generated/prisma/client";
import { deleteUser } from "@/lib/actions/users";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteAnimal } from "@/lib/actions/animals";
import { useState } from "react";

export const columns: ColumnDef<Animal>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "commonName",
    header: "Common Name",
  },
  {
    accessorKey: "species",
    header: "Species",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("species")}</div>
    ),
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "sex",
    header: () => <div className="ml-6">Sex</div>,
    cell: ({ row }) => {
      const sex = String(row.getValue("sex")).toUpperCase();

      const getIconProps = () => {
        switch (sex) {
          case "MALE":
            return { Icon: Mars, className: "h-4 w-4 text-blue-600" };
          case "FEMALE":
            return { Icon: Venus, className: "h-4 w-4 text-pink-600" };
          case "UNKNOWN":
            return { Icon: HelpCircle, className: "h-4 w-4 text-gray-500" };
          default:
            return { Icon: HelpCircle, className: "h-4 w-4 text-gray-500" };
        }
      };

      const { Icon, className } = getIconProps();

      return (
        <div className="flex items-center gap-2">
          <Icon className={className} />
          <span className="font-medium text-foreground">{sex}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "weight",
    header: "Weight",
  },

  {
    accessorKey: "healthStatus",
    filterFn: (row, id, value) => {
      if (!value) return true; // All
      return row.getValue(id) === value;
    },
    header: ({ column }) => (
      <div className="flex items-center justify-between w-full h-8 px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation(); // Prevent any sorting
              }}
            >
              Health Status
              <ChevronUp />
              <span className="sr-only">Filter health status</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter health status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => column.setFilterValue("")}
              className="cursor-pointer"
            >
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("HEALTHY")}
              className="cursor-pointer"
            >
              Healthy
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("OBSERVATION")}
              className="cursor-pointer"
            >
              Observation
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("UNHEALTHY")}
              className="cursor-pointer"
            >
              Unhealthy
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    cell: ({ row }) => {
      const health = String(row.getValue("healthStatus")).toUpperCase();

      const getIconProps = () => {
        switch (health) {
          case "HEALTHY":
            return { Icon: ShieldCheck, className: "h-4 w-4 text-green-600" };
          case "OBSERVATION":
            return { Icon: Activity, className: "h-4 w-4 text-amber-600" };
          case "UNHEALTHY":
            return { Icon: AlertCircle, className: "h-4 w-4 text-red-600" };
          default:
            return { Icon: Activity, className: "h-4 w-4 text-gray-500" };
        }
      };

      const { Icon, className } = getIconProps();

      return (
        <div className="flex items-center gap-2">
          <Icon className={className} />
          <span className="font-medium text-foreground">{health}</span>
        </div>
      );
    },
  },

  {
    id: "arrivalDate",
    accessorFn: (row) =>
      new Date(row.arrivalDate).toLocaleDateString("default"),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Arrival date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.arrivalDate);
      return (
        <div className="font-mono text-xs text-muted-foreground px-4">
          {date.toLocaleDateString("default", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const router = useRouter();
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/home/animals/${row.original.id}`)
                  }
                >
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/home/animals/${row.original.id}/edit`)
                  }
                >
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete
                </DropdownMenuItem>
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
                  Delete animal "{row.original.name}"
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form
                  action={deleteAnimal.bind(null, row.original.id)}
                  onSubmit={() => setShowDeleteDialog(false)}
                >
                  <AlertDialogAction type="submit" variant="destructive">
                    Delete
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];
