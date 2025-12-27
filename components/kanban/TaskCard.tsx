"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MaintenanceRequest, User, Equipment } from "@/types";
import { MOCK_USERS, MOCK_EQUIPMENT } from "@/lib/mock-data";
import { Clock, AlertCircle, Hammer } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface TaskCardProps {
  request: MaintenanceRequest;
}

export function TaskCard({ request }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: request.id,
    data: request,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 0,
      }
    : undefined;

  const technician = MOCK_USERS.find((u) => u.id === request.technicianId);
  const equipment = MOCK_EQUIPMENT.find((e) => e.id === request.equipmentId);

  const isOverdue = new Date(request.scheduledDate) < new Date() && request.status !== "Repaired";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="mb-4 last:mb-0 cursor-grab active:cursor-grabbing touch-none"
    >
      <Card
        className={cn(
          "group border-l-4 transition-all hover:ring-2 hover:ring-primary/20",
          isOverdue ? "border-l-red-500" : "border-l-transparent"
        )}
      >
        <CardHeader className="p-4 pb-2 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-semibold text-sm leading-tight line-clamp-2">{request.subject}</h4>
            <Badge
              variant={request.type === "Corrective" ? "destructive" : "info"}
              className="text-[10px] shrink-0"
            >
              {request.type}
            </Badge>
          </div>
          {equipment && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Hammer className="w-3 h-3" />
              <span>{equipment.name}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Clock className={cn("w-3 h-3", isOverdue && "text-red-500")} />
              <span className={isOverdue ? "text-red-500" : ""}>
                {formatDate(request.scheduledDate)}
              </span>
            </div>

            <div className="flex -space-x-2">
              {technician ? (
                <div
                  className="w-6 h-6 rounded-full border-2 border-background overflow-hidden"
                  title={technician.name}
                >
                  <img
                    src={technician.avatar}
                    alt={technician.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center"
                  title="Unassigned"
                >
                  <UserIcon className="w-3 h-3 text-muted-foreground/50" />
                </div>
              )}
            </div>
          </div>

          {isOverdue && (
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-red-500 uppercase tracking-wider">
              <AlertCircle className="w-3 h-3" />
              Overdue
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
