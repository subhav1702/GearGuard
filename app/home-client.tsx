"use client";

import { useState } from "react";
import { KanbanBoard } from "@/components/kanban/Board";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RequestForm } from "@/components/forms/RequestForm";

export default function HomeClient() {
    const [formOpen, setFormOpen] = useState(false);

    return (
        <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                        Manage and track your equipment service pipeline.
                    </p>
                </div>
                <Button
                    onClick={() => setFormOpen(true)}
                    className="rounded-xl px-6 gap-2 h-11 premium-shadow"
                >
                    <Plus className="w-5 h-5" />
                    New Request
                </Button>
            </div>

            <div className="flex-1 min-h-0 bg-white/40 rounded-3xl p-6 border border-white">
                <KanbanBoard />
            </div>

            <RequestForm
                open={formOpen}
                onOpenChange={setFormOpen}
                onSubmit={(data) => console.log("Form Data:", data)}
            />
        </div>
    );
}
