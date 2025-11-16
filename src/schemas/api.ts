import { z } from "zod";

// Request/Response schemas
export const CreateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

// Paginated response
export const PaginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  });

export const UsersResponseSchema = PaginatedSchema(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

export type UsersResponse = z.infer<typeof UsersResponseSchema>;
