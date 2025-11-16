import { IUser } from "@/types/user";
import { serverApiClient } from "../server-client";

export const authServerService = {
  me: async (): Promise<IUser | null> => {
    try {
      return await serverApiClient.get<IUser>("/auth/me");
    } catch (error) {
      if (error && typeof error === "object" && "digest" in error) {
        throw error;
      }
      console.error("Failed to fetch user:", error);
      return null;
    }
  },
};
