import {z} from "zod";

export const updateMeSchema = z.object({
    name : z.string().trim().max(50).optional(),
    bio : z.string().trim().max(300).optional(),
    avatarUrl : z.string().url().optional(),
    bannerUrl : z.string().url().optional(),
}).refine((d) => Object.keys(d).length > 0, {message : "Nothing to update"});

export const changePasswordSchema = z.object({
    currentPassword : z.string(),
    newPassword : z.string().min(8).max(72),
})

export const usernameParamSchema = z.object({
    params: z.object({username : z.string().min(3).max(20)}),
});

export const feedQuerySchema = z.object({
    cursor : z.string().optional(),
    limit : z.coerce.number().int().min(1).max(50).optional(),
});

export type UpdateMeInput = z.infer<typeof updateMeSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UserNameParam = z.infer<typeof usernameParamSchema>;
export type FeedQuery = z.infer<typeof feedQuerySchema>;