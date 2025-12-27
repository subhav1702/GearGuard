import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required").min(2, "Department name must be at least 2 characters"),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;
