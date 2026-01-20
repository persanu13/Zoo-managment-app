"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DeleteIcon,
  MoreHorizontal,
  Shield,
  SquarePen,
  Trash2,
  User,
  Users,
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

import { User as UserPrisma } from "@/generated/prisma/client";
import { ArrowUpDown } from "lucide-react";

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
    header: "Role",
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

    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="cursor-pointer">
            <SquarePen size="16" />
          </Button>
          <Button variant="destructive" size="icon" className="cursor-pointer">
            <Trash2 size="16" />
          </Button>
        </div>
      );
    },
  },
];
