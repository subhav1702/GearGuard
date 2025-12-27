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
    const response = await axiosInstance.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/signup", data);
    return response.data;
  },
};
