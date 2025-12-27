import { API_ROUTES } from "../common/constants";
import { axiosInstance } from "./axios";

export interface Department {
  id: string;
  name: string;
}

export type CreateDepartmentInput = { name: string };

export const departmentsApi = {
  getAll: async (): Promise<Department[]> => {
    const response = await axiosInstance.get<Department[]>(API_ROUTES.DEPARTMENTS);
    return response.data;
  },

  create: async (data: CreateDepartmentInput): Promise<Department> => {
    const response = await axiosInstance.post<Department>(API_ROUTES.DEPARTMENTS, data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateDepartmentInput>): Promise<Department> => {
    const response = await axiosInstance.patch<Department>(`${API_ROUTES.DEPARTMENTS}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ROUTES.DEPARTMENTS}/${id}`);
  },
};
