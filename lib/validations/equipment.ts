import { z } from "zod";

export const equipmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  serial_number: z.string().min(1, "Serial Number is required"),
  location: z.string().min(1, "Location is required"),
  purchase_date: z.string().min(1, "Purchase Date is required"),
  warranty_expiry: z.string().min(1, "Warranty Expiry is required"),
  department_id: z.number().int().positive("Department is required"),
  maintenance_team_id: z.number().int().positive("Maintenance Team is required"),
  default_technician_id: z.number().int().positive().optional(),
  owner_id: z.number().int().positive("Owner is required"),
  status: z.enum(["Operational", "Down", "Maintenance"]),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  installDate: z.string().optional(),
  category: z.enum(["Machine", "Vehicle", "Tool", "WorkCenter"]).optional(),
  image: z.string().optional(),
  code: z.string().optional(), // For WorkCenters
});

export type EquipmentInput = z.infer<typeof equipmentSchema>;
