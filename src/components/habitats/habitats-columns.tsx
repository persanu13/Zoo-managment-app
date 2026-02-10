"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  DoorClosed,
  DoorOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useUser } from "@/contexts/user-context";

// import { deleteHabitat } from "@/lib/actions/habitats"; // dacă ai delete

export type HabitatRow = {
  id: string;
  number: number;
  name: string;
  type: string;
  capacity: number;
  closed: boolean;
  updatedAt: Date | string;
  _count: { animals: number };
};

export const columns: ColumnDef<HabitatRow>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">
        #{row.original.number}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="capitalize text-muted-foreground">
        {row.original.type}
      </div>
    ),
  },
  {
    id: "capacity",
    header: "Capacity",
    cell: ({ row }) => {
      const current = row.original._count?.animals ?? 0;
      const max = row.original.capacity ?? 0;

      const isOver = max > 0 && current > max;
      const isFull = max > 0 && current === max;

      return (
        <div className="flex items-center gap-2">
          <span className="font-medium tabular-nums">
            {current}/{max}
          </span>

          {isOver ? (
            <Badge variant="destructive">Over</Badge>
          ) : isFull ? (
            <Badge variant="secondary">Full</Badge>
          ) : (
            <Badge variant="outline">OK</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "closed",
    header: "Status",
    cell: ({ row }) => {
      const closed = row.original.closed;

      const Icon = closed ? DoorClosed : DoorOpen;

      return (
        <div className="flex items-center gap-2">
          <Icon
            className={
              closed ? "h-4 w-4 text-red-600" : "h-4 w-4 text-green-600"
            }
          />
          <Badge variant={closed ? "destructive" : "secondary"}>
            {closed ? "Closed" : "Open"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "updatedAt",
    accessorFn: (row) => new Date(row.updatedAt),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const d = new Date(row.original.updatedAt);
      return (
        <div className="font-mono text-xs text-muted-foreground">
          {d.toLocaleDateString("default", {
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
      const user = useUser();

      if (user?.role === "STAFF") {
        return;
      } else {
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/home/habitats/${row.original.id}/edit`)
                    }
                  >
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      }
    },
  },
];
