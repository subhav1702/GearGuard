import { API_ROUTES } from "../common/constants";
import { axiosInstance } from "./axios";

export interface Equipment {
  id: string;
  name: string;
  serial_number: string;
  location: string;
  purchase_date: string;
  warranty_expiry: string;
  department_id: number;
  maintenance_team_id: number;
  default_technician_id?: number;
  owner_id: number;
  status: "Operational" | "Down" | "Maintenance";
  model?: string;
  manufacturer?: string;
  installDate?: string;
  lastService?: string;
  nextService?: string;
  image?: string;
  category?: "Machine" | "Vehicle" | "Tool" | "WorkCenter";
  code?: string; // For WorkCenters
}

export type CreateEquipmentInput = Omit<Equipment, "id">;

export interface EquipmentFilters {
  department_id?: number;
  employee_id?: number;
}

export const equipmentApi = {
  getAll: async (filters?: EquipmentFilters): Promise<Equipment[]> => {
    const params = new URLSearchParams();
    if (filters?.department_id) params.append("department_id", filters.department_id.toString());
    if (filters?.employee_id) params.append("employee_id", filters.employee_id.toString());

    const url = params.toString() 
      ? `${API_ROUTES.EQUIPMENT}?${params.toString()}`
      : API_ROUTES.EQUIPMENT;

    const response = await axiosInstance.get<Equipment[]>(url);
    return response.data;
  },

  getById: async (id: string): Promise<Equipment> => {
    const response = await axiosInstance.get<Equipment>(`${API_ROUTES.EQUIPMENT}/${id}`);
    return response.data;
  },

  getRequests: async (id: string): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>(`${API_ROUTES.EQUIPMENT}/${id}/requests`);
    return response.data;
  },

  create: async (data: CreateEquipmentInput): Promise<Equipment> => {
    const response = await axiosInstance.post<Equipment>(API_ROUTES.EQUIPMENT, data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateEquipmentInput>): Promise<Equipment> => {
    const response = await axiosInstance.patch<Equipment>(`${API_ROUTES.EQUIPMENT}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ROUTES.EQUIPMENT}/${id}`);
  },
};

