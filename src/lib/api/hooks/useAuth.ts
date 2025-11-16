import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth";
import { IAuthResponse, ILoginInput, IRegisterInput } from "@/types/auth";
import { useAuthStore } from "@/stores/auth";

export function useAuthMutations() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: (data: IAuthResponse) => {
      useAuthStore.getState().setAuth(data);
      router.push("/");
    },
  });

  const register = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/");
    },
  });

  return { login, register };
}
