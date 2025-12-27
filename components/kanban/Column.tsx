"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { MaintenanceRequest, RequestStatus } from "@/types";
import { TaskCard } from "./TaskCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ColumnProps {
  status: RequestStatus;
  requests: MaintenanceRequest[];
}

export function Column({ status, requests }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "New":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "In Progress":
        return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "Repaired":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "Scrap":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-full min-w-[300px] max-w-[350px]">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm tracking-tight uppercase">{status}</h3>
          <Badge variant="secondary" className="rounded-sm font-bold opacity-70">
            {requests.length}
          </Badge>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 rounded-xl transition-colors min-h-[500px]",
          isOver ? "bg-accent/50" : "bg-muted/30"
        )}
      >
        <div className="space-y-1">
          {requests.map((request) => (
            <TaskCard key={request.id} request={request} />
          ))}
          {requests.length === 0 && !isOver && (
            <div className="h-24 flex items-center justify-center rounded-lg border-2 border-dashed border-border/50 text-muted-foreground/30 text-xs font-medium italic">
              No requests here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
