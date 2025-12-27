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
import { MessageSquare, Send, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function WorksheetDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const { user } = useAuth();

  const comments: any[] = [];

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
            {comments.map((c: any) => (
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
            {comments.length === 0 && (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <MessageSquare size={20} />
                </div>
                <p className="text-sm font-medium text-slate-500">No notes yet.</p>
              </div>
            )}
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
