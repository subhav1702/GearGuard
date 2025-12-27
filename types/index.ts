export type UserRole = "Admin" | "User";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type EquipmentCategory = "Machine" | "Vehicle" | "Tool" | "WorkCenter" | "Production" | "IT" | "Logistics" | "Facilities";

export interface Team {
  id: string;
  name: string; // e.g., "Mechanics", "Electricians", "IT Support"
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  department_id: number;
  members: TeamMember[];
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
  location: string;
  purchaseDate: string;
  warrantyExpiration: string;
  departmentId: number;
  maintenanceTeamId: number;
  defaultTechnicianId?: number;
  ownerId: number;
  status: "Operational" | "Down" | "Maintenance" | "active" | "scrapped";
  model?: string;
  manufacturer?: string;
  installDate?: string;
  lastService?: string;
  nextService?: string;
  image?: string;
  category?: EquipmentCategory;
  code?: string;
  department?: string;
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
