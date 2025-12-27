import { z } from "zod";


export const teamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  department_id: z.coerce.number().min(1, "Department is required"),
});

export const addMemberSchema = z.object({
  user_id: z.coerce.number().min(1, "User is required"),
});

export type TeamInput = z.infer<typeof teamSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;

