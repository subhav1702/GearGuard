"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, User } from "lucide-react";
import { MOCK_USERS } from "@/lib/mock-data";

export function WorksheetDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");

  const mockComments = [
    {
      id: 1,
      user: MOCK_USERS[1],
      date: "2025-12-27 10:30",
      text: "Checked the hydraulic pressure, it seems stable for now but needs watching.",
    },
    {
      id: 2,
      user: MOCK_USERS[0],
      date: "2025-12-27 11:15",
      text: "Please proceed with the parts replacement as soon as they arrive.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none">
        <div className="bg-slate-50 border-b border-slate-100 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              Worksheet Notes
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {mockComments.map((c) => (
              <div
                key={c.id}
                className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm"
              >
                <img src={c.user.avatar} className="w-10 h-10 rounded-full" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{c.user.name}</span>
                    <span className="text-[10px] font-medium text-slate-400">{c.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Add a new note
            </Label>
            <div className="relative">
              <Textarea
                placeholder="Type your observations here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] rounded-2xl bg-slate-100/50 border-none shadow-sm resize-none pr-12 focus-visible:ring-primary"
              />
              <Button
                size="icon"
                className="absolute bottom-3 right-3 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg"
                onClick={() => {
                  if (comment.trim()) {
                    setComment("");
                  }
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
