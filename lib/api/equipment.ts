import { API_ROUTES } from "../common/constants";
import { axiosInstance } from "./axios";
import { Equipment } from "@/types";


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

    const response = await axiosInstance.get<any[]>(url);
    
    // Map snake_case to camelCase
    return response.data.map((item: any) => ({
      ...item,
      serialNumber: item.serial_number || item.serialNumber,
      purchaseDate: item.purchase_date || item.purchaseDate,
      warrantyExpiration: item.warranty_expiry || item.warrantyExpiration,
      departmentId: item.department_id || item.departmentId,
      maintenanceTeamId: item.maintenance_team_id || item.maintenanceTeamId,
      defaultTechnicianId: item.default_technician_id || item.defaultTechnicianId,
      ownerId: item.owner_id || item.ownerId,
      category: item.category || "Machine",
    }));
  },

  getById: async (id: string): Promise<Equipment> => {
    const response = await axiosInstance.get<any>(`${API_ROUTES.EQUIPMENT}/${id}`);
    const item = response.data;
    return {
      ...item,
      serialNumber: item.serial_number || item.serialNumber,
      purchaseDate: item.purchase_date || item.purchaseDate,
      warrantyExpiration: item.warranty_expiry || item.warrantyExpiration,
      departmentId: item.department_id || item.departmentId,
      maintenanceTeamId: item.maintenance_team_id || item.maintenanceTeamId,
      defaultTechnicianId: item.default_technician_id || item.defaultTechnicianId,
      ownerId: item.owner_id || item.ownerId,
      category: item.category || "Machine",
    };
  },

  getRequests: async (id: string): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>(`${API_ROUTES.EQUIPMENT}/${id}/requests`);
    return response.data;
  },

  create: async (data: CreateEquipmentInput): Promise<Equipment> => {
    // Map camelCase back to snake_case for the API
    const apiData = {
      ...data,
      serial_number: data.serialNumber,
      purchase_date: data.purchaseDate,
      warranty_expiry: data.warrantyExpiration,
      department_id: data.departmentId,
      maintenance_team_id: data.maintenanceTeamId,
      default_technician_id: data.defaultTechnicianId,
      owner_id: data.ownerId,
    };
    const response = await axiosInstance.post<Equipment>(API_ROUTES.EQUIPMENT, apiData);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateEquipmentInput>): Promise<Equipment> => {
    // Map camelCase back to snake_case for the API
    const apiData: any = { ...data };
    if (data.serialNumber) { apiData.serial_number = data.serialNumber; delete apiData.serialNumber; }
    if (data.purchaseDate) { apiData.purchase_date = data.purchaseDate; delete apiData.purchaseDate; }
    if (data.warrantyExpiration) { apiData.warranty_expiry = data.warrantyExpiration; delete apiData.warrantyExpiration; }
    if (data.departmentId) { apiData.department_id = data.departmentId; delete apiData.departmentId; }
    if (data.maintenanceTeamId) { apiData.maintenance_team_id = data.maintenanceTeamId; delete apiData.maintenanceTeamId; }
    if (data.defaultTechnicianId) { apiData.default_technician_id = data.defaultTechnicianId; delete apiData.defaultTechnicianId; }
    if (data.ownerId) { apiData.owner_id = data.ownerId; delete apiData.ownerId; }

    const response = await axiosInstance.patch<Equipment>(`${API_ROUTES.EQUIPMENT}/${id}`, apiData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ROUTES.EQUIPMENT}/${id}`);
  },
};

