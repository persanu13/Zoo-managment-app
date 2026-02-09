import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  Tag,
  ShieldCheck,
  Activity,
  Ban,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronsUp,
  ChevronUp,
  ChevronDown,
  Utensils,
  SprayCan,
  Stethoscope,
  Wrench,
  Truck,
  Package,
  ListTodo,
  Eye,
  Circle,
} from "lucide-react";

function formatDate(value?: Date | string | null) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("ro-RO", { dateStyle: "long" }).format(d);
}

function userLabel(
  u?: TaskViewModel["createdBy"] | TaskViewModel["assignedTo"],
) {
  if (!u) return "—";
  return u.name?.trim() || u.email?.trim() || "—";
}

function typeMeta(type: TaskViewModel["type"]) {
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
      return { Icon: Tag, label: String(type) };
  }
}

function statusMeta(status: TaskViewModel["status"]) {
  switch (status) {
    case "TODO":
      return {
        Icon: Circle,
        label: "TODO",
        className: "text-muted-foreground",
      };
    case "IN_PROGRESS":
      return {
        Icon: Activity,
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

function priorityMeta(priority: TaskViewModel["priority"]) {
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

type TaskViewModel = {
  id: string;
  title: string;
  description?: string | null;

  type:
    | "GENERAL"
    | "FEEDING"
    | "CLEANING"
    | "MEDICAL"
    | "MAINTENANCE"
    | "TRANSFER"
    | "INVENTORY";

  status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";

  dueDate?: Date | string | null;
  startAt?: Date | string | null;
  completedAt?: Date | string | null;

  createdAt: Date | string;

  createdBy?: { name?: string | null; email?: string | null } | null;
  assignedTo?: { name?: string | null; email?: string | null } | null;

  animal?: { id: string; name: string } | null;
  habitat?: { id: string; name: string; number?: number | null } | null;
  treatment?: { id: string; title: string } | null;
};

function Chip({
  icon: Icon,
  label,
  className,
}: {
  icon: any;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1 text-xs font-medium ${className ?? ""}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </span>
  );
}

export function TaskView({
  task,
  open,
  onOpenChange,
}: {
  task: TaskViewModel;
  open: boolean;
  onOpenChange: any;
}) {
  const t = typeMeta(task.type);
  const s = statusMeta(task.status);
  const p = priorityMeta(task.priority);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="border-b bg-background px-6 py-5 shadow-[0px_3px_4px_rgba(0,0,0,0.2)]">
          <DialogTitle className="text-base font-semibold">
            {task.title}
          </DialogTitle>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Chip icon={t.Icon} label={t.label} />
            <Chip icon={s.Icon} label={s.label} className={s.className} />
            <Chip icon={p.Icon} label={p.label} className={p.className} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Due: {formatDate(task.dueDate)}</span>
            </span>

            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Assigned: {userLabel(task.assignedTo)}</span>
            </span>

            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Created by: {userLabel(task.createdBy)}</span>
            </span>
          </div>
        </DialogHeader>

        <Separator orientation="horizontal" />

        <div className="no-scrollbar max-h-[50vh] min-h-[50vh] overflow-y-auto px-6 py-5 space-y-4">
          {/* DESCRIPTION */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </div>

            {task.description?.trim() ? (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {task.description}
              </p>
            ) : (
              <div className="mt-2 rounded-md border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                No description provided.
              </div>
            )}
          </div>

          {/* LINKS */}
          <div className="rounded-lg border bg-muted/20 p-4 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Linked entities
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Animal:</span>{" "}
              <span className="font-medium">{task.animal?.name ?? "—"}</span>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Habitat:</span>{" "}
              <span className="font-medium">
                {task.habitat
                  ? `${typeof task.habitat.number === "number" ? `#${task.habitat.number} — ` : ""}${task.habitat.name}`
                  : "—"}
              </span>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Treatment:</span>{" "}
              <span className="font-medium">
                {task.treatment?.title ?? "—"}
              </span>
            </div>
          </div>

          {/* TIMELINE (optional) */}
          <div className="rounded-lg border bg-muted/10 p-4 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Timeline
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Start:</span>{" "}
              <span className="font-medium">{formatDate(task.startAt)}</span>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Completed:</span>{" "}
              <span className="font-medium">
                {formatDate(task.completedAt)}
              </span>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Created:</span>{" "}
              <span className="font-medium">{formatDate(task.createdAt)}</span>
            </div>
          </div>
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
