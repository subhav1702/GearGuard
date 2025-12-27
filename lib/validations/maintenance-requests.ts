import { z } from "zod";

export const correctiveRequestSchema = z.object({
  subject: z.string().min(1, "Subject is required").min(3, "Subject must be at least 3 characters"),
  request_type: z.literal("corrective"),
  equipment_id: z.number().int().positive("Equipment is required"),
});

export const preventiveRequestSchema = z.object({
  subject: z.string().min(1, "Subject is required").min(3, "Subject must be at least 3 characters"),
  request_type: z.literal("preventive"),
  equipment_id: z.number().int().positive("Equipment is required"),
  scheduled_at: z.string().min(1, "Scheduled date/time is required"),
});

export const completeRequestSchema = z.object({
  duration: z.number().positive("Duration must be greater than 0").max(999, "Duration cannot exceed 999 hours"),
});

export type CorrectiveRequestInput = z.infer<typeof correctiveRequestSchema>;
export type PreventiveRequestInput = z.infer<typeof preventiveRequestSchema>;
export type CompleteRequestInput = z.infer<typeof completeRequestSchema>;
