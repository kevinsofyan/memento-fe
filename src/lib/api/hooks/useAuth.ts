import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth';
import { AuthResponse, LoginInput, RegisterInput } from '@/types/auth';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (data: AuthResponse) => {
      setAuth(data);
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: async (data: AuthResponse) => {
      setAuth(data);
      await queryClient.refetchQueries({ queryKey: ['user'] });
      router.push('/');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearUser = useUserStore((state) => state.clearUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    },
    onSettled: () => {
      clearAuth();
      clearUser();
      queryClient.clear();
      router.push('/login');
      router.refresh();
    },
  });
}

