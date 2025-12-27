import { API_ROUTES } from "../common/constants";
import { axiosInstance } from "./axios";

export interface MaintenanceTeam {
  id: string;
  name: string;
  department_id: number;
  members: TeamMember[];
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
}

export interface CreateTeamInput {
  name: string;
  department_id: number;
}

export const teamsApi = {
  getAll: async (): Promise<MaintenanceTeam[]> => {
    const response = await axiosInstance.get<MaintenanceTeam[]>(API_ROUTES.MAINTENANCE_TEAMS);
    return response.data;
  },

  create: async (data: CreateTeamInput): Promise<MaintenanceTeam> => {
    const response = await axiosInstance.post<MaintenanceTeam>(API_ROUTES.MAINTENANCE_TEAMS, data);
    return response.data;
  },

  addMember: async (teamId: string, userId: number): Promise<void> => {
    await axiosInstance.post(`${API_ROUTES.MAINTENANCE_TEAMS}/${teamId}/add_member`, {
      user_id: userId,
    });
  },

  removeMember: async (teamId: string, userId: number): Promise<void> => {
    await axiosInstance.delete(`${API_ROUTES.MAINTENANCE_TEAMS}/${teamId}/remove_member`, {
      data: { user_id: userId },
    });
  },


  update: async (id: string, data: Partial<CreateTeamInput>): Promise<MaintenanceTeam> => {
    const response = await axiosInstance.patch<MaintenanceTeam>(`${API_ROUTES.MAINTENANCE_TEAMS}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ROUTES.MAINTENANCE_TEAMS}/${id}`);
  },
};
