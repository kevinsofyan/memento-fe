import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { IUser } from "@/types/user";
import { useMemo, useEffect } from "react";

const USER_QUERY_KEY = ["userServer"];

export function useFetchUser() {
  const access_token = useAuthStore((state) => state.access_token);

  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      const user = await authService.me(access_token!);
      return user;
    },
    enabled: !!access_token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUser() {
  const queryClient = useQueryClient();
  const storeUser = useUserStore((state) => state.user);
  const setStoreUser = useUserStore((state) => state.setUser);
  const clearStoreUser = useUserStore((state) => state.clearUser);

  const { data: queryUser, isLoading, error, refetch } = useFetchUser();

  useEffect(() => {
    if (queryUser) {
      setStoreUser(queryUser);
    }
  }, [queryUser, setStoreUser]);

  useEffect(() => {
    if (error) {
      clearStoreUser();
    }
  }, [error, clearStoreUser]);

  const user = queryUser || storeUser;

  const updateUser = (userData: IUser) => {
    setStoreUser(userData);
    queryClient.setQueryData<IUser>(USER_QUERY_KEY, userData);
  };

  const removeUser = () => {
    clearStoreUser();
    queryClient.setQueryData(USER_QUERY_KEY, null);
  };

  return useMemo(
    () => ({
      user,
      isLoading,
      error,
      setUser: updateUser,
      clearUser: removeUser,
      refetch,
    }),
    [user, isLoading, error, refetch]
  );
}
