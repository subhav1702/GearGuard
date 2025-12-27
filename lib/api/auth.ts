import { API_ROUTES } from "../common/constants";
import { axiosInstance } from "./axios";
import { LoginInput, SignupInput } from "@/lib/validations/auth";

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
  token: string;
}

export interface SignupRequest extends Omit<SignupInput, "confirmPassword"> {
  confirm_password: string;
}

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(API_ROUTES.LOGIN, data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(API_ROUTES.SIGNUP, data);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string; reset_token: string }> => {
    const response = await axiosInstance.post<{ message: string; reset_token: string }>(API_ROUTES.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (data: any): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(API_ROUTES.RESET_PASSWORD, data);
    return response.data;
  }
};
