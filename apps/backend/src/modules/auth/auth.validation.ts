import {z} from 'zod';

export const registerSchema = z.object({
    body : z.object({
        email : z.string().trim().toLowerCase().email(),
        username : z.string().trim().toLowerCase().min(3).max(20)
        .regex(/^[a-z0-9_]+$/, "only lowercase letters, numbers and underscore"),
        password : z.string().min(8).max(72),
        name : z.string().trim().max(50).optional(),
    }),
});

export const loginSchema = z.object({
   body : z.object({
    identifier : z.string().trim().toLowerCase(),
    password : z.string(),
   }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"]
export type LoginInput = z.infer<typeof loginSchema>["body"];
