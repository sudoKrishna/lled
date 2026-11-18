/**
 * here we go 
 * 
 * first validation it 
 * 
 * what doing there i explin 
 * first username me username ho  
 * follow action schema me 
 * valida the action like not follow , unfollow 
 * else like {action : "like" , unlike }it validate this 
 * 
 * followerquesy liek follower?cursor=abd&limit=20 mean or nahi jasakte
 * 
 * 
 */

import {z} from "zod";

export const usernameParamSchema = z.object({
    username : z.string().min(1),
});

export const followActionSchema = z.object({
    action : z.enum(["follow", "unfollow"])
});

export const followersQuerySchema  = z.object({
    cursor : z.string().optional(),
    limit : z.coerce.number().int().min(1).max(50).default(20),
});



export type UserParamInput = z.infer<typeof usernameParamSchema>
export type FollowActionInput = z.infer<typeof followActionSchema>
export type FollowerQuery = z.infer<typeof followersQuerySchema>
