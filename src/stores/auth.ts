import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cookieStorage } from "@/lib/cookie-storage";

interface AuthData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  expires_in: number | null;
  setAuth: (data: AuthData) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access_token: null,
      refresh_token: null,
      expires_in: null,
      setAuth: (data: AuthData) =>
        set({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_in: data.expires_in,
        }),
      clearAuth: () =>
        set({
          access_token: null,
          refresh_token: null,
          expires_in: null,
        }),
    }),
    {
      name: "memento-auth-storage",
      storage: cookieStorage,
    }
  )
);
