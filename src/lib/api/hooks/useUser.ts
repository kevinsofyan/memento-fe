import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

const USER_QUERY_KEY = ['user'];

export function useUser() {
  const access_token = useAuthStore((state) => state.access_token);

  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      if (!access_token) return null;
      try {
        const user = await authService.me(access_token);
        useUserStore.getState().setUser(user);
        return user;
      } catch (error) {
        useAuthStore.getState().clearAuth();
        useUserStore.getState().clearUser();
        throw error;
      }
    },
    enabled: !!access_token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

