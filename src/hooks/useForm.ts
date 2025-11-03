import { useCallback } from "react";
import { useForm as useReactHookForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";

/**
 * Custom hook that combines React Hook Form with Zod validation
 */
export function useForm(
  schema: ZodSchema,
  options?: Omit<UseFormProps, "resolver">
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const form = useReactHookForm({
    // @ts-expect-error - zodResolver type constraint issue
    resolver: zodResolver(schema),
    ...options,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  const onError = useCallback((error: unknown) => {
    console.error("Form error:", error);
  }, []);

  return { ...form, onError };
}
