import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cookieStorage } from "@/lib/cookie-storage";
import { IUser } from "@/types/user";
interface UserState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      storage: cookieStorage,
    }
  )
);
