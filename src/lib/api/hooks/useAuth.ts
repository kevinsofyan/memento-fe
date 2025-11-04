import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth';
import { AuthResponse, LoginInput, RegisterInput } from '@/types/auth';

export function useAuthMutations() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const register = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/');
    },
  });

  const logout = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      queryClient.clear();
      router.push('/login');
      router.refresh();
    },
  });

  return { login, register, logout };
}

