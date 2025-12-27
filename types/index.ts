export type UserRole = "Admin" | "User";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type EquipmentCategory = "Production" | "IT" | "Logistics" | "Facilities";

export interface Team {
  id: string;
  name: string; // e.g., "Mechanics", "Electricians", "IT Support"
}

export interface WorkCenter {
  id: string;
  name: string;
  code: string;
  category?: string;
  department?: string;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: EquipmentCategory;
  department: string;
  location: string;
  purchaseDate: string;
  warrantyExpiration: string;
  ownerId: string; // Employee name or ID
  maintenanceTeamId: string;
  defaultTechnicianId?: string;
  status: "active" | "scrapped";
}

export type RequestType = "Corrective" | "Preventive";

export type RequestStatus =
  | "New"
  | "In Progress"
  | "Repaired"
  | "Scrap"
  | "Blocked"
  | "Ready for next stage";

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description?: string;
  type: RequestType;
  equipmentId?: string;
  workCenterId?: string;
  teamId: string;
  status: RequestStatus;
  scheduledDate: string;
  duration?: number; // Hours spent
  technicianId?: string;
  requestorId: string; // Employee ID
  company: string;
  category: EquipmentCategory | string;
  priority: "Low" | "Medium" | "High" | "Critical";
  createdAt: string;
  updatedAt: string;
}
