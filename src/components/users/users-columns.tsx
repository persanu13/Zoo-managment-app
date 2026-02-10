"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Shield,
  SquarePen,
  User,
  Users,
  ChevronUp,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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

import { User as UserPrisma } from "@/generated/prisma/client";
import { ArrowUpDown } from "lucide-react";
import { deleteUser } from "@/lib/actions/users";
import Link from "next/link";
import { useUser } from "@/contexts/user-context";

export const columns: ColumnDef<UserPrisma>[] = [
  {
    id: "basic_info",
    header: "Basic Info",
    accessorFn: (row) => `${row.name} ${row.email}`,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            {user.role === "SUPER_ADMIN" ? (
              <Shield className="h-4 w-4 text-destructive" />
            ) : user.role === "ADMIN" ? (
              <Users className="h-4 w-4 text-primary" />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          {/* Nume + Email */}
          <div className="truncate">
            <div className="font-medium">{user.name || "N/A"}</div>
            <div className="text-xs text-muted-foreground truncate">
              {user.email}
            </div>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "role",
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
              Role
              <ChevronUp />
              <span className="sr-only">Filter roles</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter roles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => column.setFilterValue("")}
              className="cursor-pointer"
            >
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("STAFF")}
              className="cursor-pointer"
            >
              Staff
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("ADMIN")}
              className="cursor-pointer"
            >
              Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue("SUPER_ADMIN")}
              className="cursor-pointer"
            >
              Super Admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },

  {
    id: "created_at",
    accessorFn: (row) => new Date(row.createdAt).toLocaleDateString("default"),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="font-mono text-xs text-muted-foreground">
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
    id: "updated_at",
    accessorFn: (row) => new Date(row.updatedAt).toLocaleDateString("default"),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt);
      return (
        <div className="font-mono text-xs text-muted-foreground">
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
      const user = useUser();
      const deleteUserWithId = deleteUser.bind(null, row.original.id);
      if (user?.role === "SUPER_ADMIN")
        return (
          <div className="flex gap-2 justify-end">
            <Link href={`/home/users/${row.original.id}/edit`}>
              <Button
                variant="outline"
                size="icon"
                className="cursor-pointer size-9"
              >
                <SquarePen size="16" />
              </Button>
            </Link>
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
                    Delete User "{row.original.email}"
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteUserWithId}>
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
