import { API_ROUTES } from "../common/constants";
import { axiosInstance } from "./axios";

export interface MaintenanceRequest {
  id: number;
  subject: string;
  request_type: "corrective" | "preventive";
  status: "pending" | "assigned" | "in_progress" | "completed" | "scrapped";
  equipment_id: number;
  equipment_name?: string;
  scheduled_at?: string;
  assigned_to?: number;
  assigned_to_name?: string;
  started_at?: string;
  completed_at?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCorrectiveRequestInput {
  subject: string;
  request_type: "corrective";
  equipment_id: number;
}

export interface CreatePreventiveRequestInput {
  subject: string;
  request_type: "preventive";
  equipment_id: number;
  scheduled_at: string;
}

export interface CompleteRequestInput {
  duration: number;
}

export interface MaintenanceRequestFilters {
  team_id?: number;
  calendar?: boolean;
}

export const maintenanceRequestsApi = {
  /**
   * List all maintenance requests with optional filters
   */
  getAll: async (filters?: MaintenanceRequestFilters): Promise<MaintenanceRequest[]> => {
    const params = new URLSearchParams();
    if (filters?.team_id) params.append("team_id", filters.team_id.toString());
    if (filters?.calendar) params.append("calendar", "true");

    const url = params.toString() 
      ? `${API_ROUTES.MAINTENANCE_REQUESTS}?${params.toString()}`
      : API_ROUTES.MAINTENANCE_REQUESTS;

    const response = await axiosInstance.get<MaintenanceRequest[]>(url);
    return response.data;
  },

  /**
   * Get all maintenance requests for a specific equipment
   */
  getByEquipment: async (equipmentId: number): Promise<MaintenanceRequest[]> => {
    const response = await axiosInstance.get<MaintenanceRequest[]>(
      `${API_ROUTES.EQUIPMENT}/${equipmentId}/requests`
    );
    return response.data;
  },

  /**
   * Create a corrective maintenance request (breakdown/emergency)
   */
  createCorrective: async (data: CreateCorrectiveRequestInput): Promise<MaintenanceRequest> => {
    const response = await axiosInstance.post<MaintenanceRequest>(
      API_ROUTES.MAINTENANCE_REQUESTS,
      data
    );
    return response.data;
  },

  /**
   * Create a preventive maintenance request (routine checkup)
   */
  createPreventive: async (data: CreatePreventiveRequestInput): Promise<MaintenanceRequest> => {
    const response = await axiosInstance.post<MaintenanceRequest>(
      API_ROUTES.MAINTENANCE_REQUESTS,
      data
    );
    return response.data;
  },

  /**
   * Assign request to the current logged-in user
   */
  assignSelf: async (requestId: number): Promise<MaintenanceRequest> => {
    const response = await axiosInstance.post<MaintenanceRequest>(
      `${API_ROUTES.MAINTENANCE_REQUESTS}/${requestId}/assign_self`
    );
    return response.data;
  },

  /**
   * Start work on a request (move to in_progress status)
   */
  startWork: async (requestId: number): Promise<MaintenanceRequest> => {
    const response = await axiosInstance.post<MaintenanceRequest>(
      `${API_ROUTES.MAINTENANCE_REQUESTS}/${requestId}/start_work`
    );
    return response.data;
  },

  /**
   * Complete a request and log duration
   */
  complete: async (requestId: number, data: CompleteRequestInput): Promise<MaintenanceRequest> => {
    const response = await axiosInstance.post<MaintenanceRequest>(
      `${API_ROUTES.MAINTENANCE_REQUESTS}/${requestId}/complete`,
      data
    );
    return response.data;
  },

  /**
   * Scrap a request (mark equipment as unusable)
   */
  scrap: async (requestId: number): Promise<MaintenanceRequest> => {
    const response = await axiosInstance.post<MaintenanceRequest>(
      `${API_ROUTES.MAINTENANCE_REQUESTS}/${requestId}/scrap`
    );
    return response.data;
  },

  update: async (id: number, data: Partial<CreateCorrectiveRequestInput | CreatePreventiveRequestInput>): Promise<MaintenanceRequest> => {
    const response = await axiosInstance.patch<MaintenanceRequest>(`${API_ROUTES.MAINTENANCE_REQUESTS}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ROUTES.MAINTENANCE_REQUESTS}/${id}`);
  },
};
