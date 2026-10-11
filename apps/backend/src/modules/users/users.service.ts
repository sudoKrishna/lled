import { prisma } from "@repo/database";
import type { z } from "zod";
import { AppError } from "../../middleware/error-handler.js";
import { usersRepository } from "./users.repository.js";
import { changePasswordSchema, updateMeSchema, type FeedQuery } from "./users.validation.js";
import bcrypt from "bcrypt";


/**
 * get /users/:username - public profile view
 * username
 * viewer context : does this viewer follow this user
 * for the follow button state
 *
 * update /user/me edit name , bio, avatar . banner
 *
 * update passowrd user/me/password thik bcrypt lagegi
 *
 * get /user/serach input me search
 *
 * get user/:username/post all post
 *
 *
 */

export const userService = {
   async getProfile(username :string , viewerId? : string) {
    const user = await usersRepository.findByusername(username);
    if(!user) throw new AppError(404, "user not found");

    // checking the use follow this user
    let viewerFollows = false;
    if(viewerId && viewerId !== user.id) {
        const follow = await prisma.follow.findUnique({
            where : {followerId_followingId : {followerId : viewerId, followingId :user.id}},
            select : {id : true},
        });
        viewerFollows = !!follow;
    }

    return {
        ...user, isSelf : viewerId === user.id,
        viewerFollows,
    }
   },

   async getMe (userId : string) {
    const user = await usersRepository.findById(userId);
    if(!user) throw new AppError(404 , "user not found");

    return user;
   },

    async updateMe(userId: string, input: z.infer<typeof updateMeSchema>) {
    return usersRepository.update(userId, {
      ...input,
      name: input.name === undefined ? undefined : input.name || null,
      bio: input.bio === undefined ? undefined : input.bio || null,
    });
  },

    async changePassword(userId : string, input : z.infer<typeof changePasswordSchema>) {
        const user = await prisma.user.findUnique({
            where : {id : userId},
            select : {password : true},
        });

        if(!user?.password) throw new AppError(400, "Accoutn has no poassword (Oauth?)");

        const ok = await bcrypt.compare(input.currentPassword, user.password);
        if(!ok) throw new AppError(400, "current password is incorrect");

        if(input.currentPassword === input.newPassword) {
            throw new AppError(400, "New password must be different");
        }

        const passwordHash = await bcrypt.hash(input.newPassword, 10);
        await usersRepository.update(userId, { password: passwordHash });

        return {success : true};
    },

    async search(q : string, limit : number) {
        const trimmed = q.trim();
        if(trimmed.length < 2) return [];
        return usersRepository.search(trimmed, limit);
    },

    async getUserPosts(username : string, query : FeedQuery) {
        const user = await usersRepository.findByusername(username);
        if(!user) throw new AppError(404, "user not found");

        const {postRepository} = await import("../posts/posts.repository.js");
        return postRepository.findFeed({
            cursor : query.cursor,
            limit: query.limit,
            authorId : user.id,
        });
    },
};
