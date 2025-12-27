"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { MaintenanceRequest, RequestStatus } from "@/types";
import { MOCK_REQUESTS } from "@/lib/mock-data";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function KanbanBoard() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(MOCK_REQUESTS);
  const [activeRequest, setActiveRequest] = useState<MaintenanceRequest | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const request = requests.find((r) => r.id === active.id);
    if (request) setActiveRequest(request);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveRequest(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id as RequestStatus;

    if (activeId !== overId) {
      setRequests((prev) => {
        return prev.map((req) => {
          if (req.id === activeId) {
            // Logic for scrap automation
            if (overId === "Scrap") {
              console.log("MARKING EQUIPMENT AS SCRAPPED");
              // In a real app, this would trigger an API call to mark equipment as scrapped
            }
            return { ...req, status: overId, updatedAt: new Date().toISOString() };
          }
          return req;
        });
      });
    }
  };

  const statuses: RequestStatus[] = ["New", "In Progress", "Repaired", "Scrap"];

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-8 h-full custom-scrollbar">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            requests={requests.filter((r) => r.status === status)}
          />
        ))}
      </div>

      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}
      >
        {activeRequest ? <TaskCard request={activeRequest} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
