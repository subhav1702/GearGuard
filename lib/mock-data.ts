import { User, Team, Equipment, MaintenanceRequest, WorkCenter } from "@/types";

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "John Admin",
    email: "admin@gearguard.com",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "u2",
    name: "Mike Technician",
    email: "mike@gearguard.com",
    role: "User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  },
  {
    id: "u3",
    name: "Sarah Technician",
    email: "sarah@gearguard.com",
    role: "User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
];

export const MOCK_TEAMS: Team[] = [
  { id: "t1", name: "Mechanics" },
  { id: "t2", name: "Electricians" },
  { id: "t3", name: "IT Support" },
];

export const MOCK_WORK_CENTERS: WorkCenter[] = [
  {
    id: "wc1",
    name: "Assembly Line 1",
    code: "AL-01",
    category: "Production",
    department: "Manufacturing",
  },
  {
    id: "wc2",
    name: "Packaging Section",
    code: "PS-04",
    category: "Logistics",
    department: "Distribution",
  },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: "e1",
    name: "CNC Machine 01",
    serialNumber: "CNC-2023-001",
    category: "Production",
    department: "Manufacturing",
    location: "Floor A - Section 2",
    purchaseDate: "2023-01-15",
    warrantyExpiration: "2025-01-15",
    ownerId: "Jane Doe",
    maintenanceTeamId: "t1",
    defaultTechnicianId: "u2",
    status: "active",
  },
  {
    id: "e2",
    name: "Server Rack Alpha",
    serialNumber: "SRV-9921",
    category: "IT",
    department: "IT Infrastructure",
    location: "Server Room 1",
    purchaseDate: "2022-06-10",
    warrantyExpiration: "2027-06-10",
    ownerId: "IT Dept",
    maintenanceTeamId: "t3",
    defaultTechnicianId: "u3",
    status: "active",
  },
];

export const MOCK_REQUESTS: MaintenanceRequest[] = [
  {
    id: "r1",
    subject: "Hydraulic Leak",
    description: "Oil pooling under the main actuator.",
    type: "Corrective",
    equipmentId: "e1",
    teamId: "t1",
    status: "In Progress",
    scheduledDate: "2025-12-27",
    duration: 2,
    technicianId: "u2",
    requestorId: "u2",
    company: "GearGuard Solutions",
    category: "Production",
    priority: "High",
    createdAt: "2025-12-26T10:00:00Z",
    updatedAt: "2025-12-27T09:00:00Z",
  },
  {
    id: "r2",
    subject: "Monthly Server Calibration",
    description: "Routine check of power systems.",
    type: "Preventive",
    equipmentId: "e2",
    teamId: "t3",
    status: "New",
    scheduledDate: "2025-12-30",
    requestorId: "u1",
    company: "IT Corp",
    category: "IT",
    priority: "Medium",
    createdAt: "2025-12-25T08:00:00Z",
    updatedAt: "2025-12-25T08:00:00Z",
  },
  {
    id: "r3",
    subject: "Conveyor Belt Stuck",
    description: "The main conveyor belt in Assembly Line 1 is not moving.",
    type: "Corrective",
    workCenterId: "wc1",
    teamId: "t1",
    status: "Blocked",
    scheduledDate: "2025-12-28",
    requestorId: "u3",
    company: "Manufacturing Co.",
    category: "Production",
    priority: "Critical",
    createdAt: "2025-12-27T11:00:00Z",
    updatedAt: "2025-12-27T11:00:00Z",
  },
];
