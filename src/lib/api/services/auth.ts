import { IUser } from "@/types/user";
import { apiClient } from "../client";
import { ILoginInput, IRegisterInput, IAuthResponse } from "@/types/auth";

export const authService = {
  me: (access_token: string) =>
    apiClient.get<IUser>("/auth/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    }),
  login: (data: ILoginInput) =>
    apiClient.post<IAuthResponse>("/auth/login", data),

  register: (data: IRegisterInput) =>
    apiClient.post<IAuthResponse>("/auth/register", data),

  logout: () => apiClient.post<void>("/auth/logout"),

  refreshToken: () => apiClient.post<IAuthResponse>("/auth/refresh"),
};
