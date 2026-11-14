/**
 * 
 * logic 
 * follow karna hai 
 * unfollow karna hai
 * 
 * fir 
 * kis kis ko follow kar rakah hai 
 * kon kon follow kar ta hai ye hai 
 * chalo let start
 * 
 * can i get a hoiya
 * 
 * 
 */

import { prisma } from "@repo/database"
import { AppError } from "../../middleware/error-handler.js";
import { followsRepository } from "./follows.repository.js";
import { FollowerQuery } from "./follows.validation.js";

export const followsService = {
    async follow(followerId: string, targetUsername: string) {
        return this.toggle(followerId, targetUsername, "follow")
    },

    async unfollow(followerId: string, targetUsername: string) {
        return this.toggle(followerId, targetUsername, "unfollow")
    },

    async toggle(followerId: string, targetUsername: string, action: "follow" | "unfollow") {
        const target = await prisma.user.findUnique({
            where: { username: targetUsername },
            select: { id: true },
        });

        if (!target) throw new AppError(404, "User not found");

        const { id: targetId } = target;

        // tamjate hai break wait ke karne isko  ok let do this 

        if (action = "follow") {
            // if you follow your self remove 
            if (targetId === followerId) throw new AppError(400, "you can't follow yourself");

            const already = await followsRepository.exists(followerId, targetId);
            if (already) throw new AppError(409, "Already following");

            await prisma.$transaction([
                prisma.follow.create({ data: { followerId, followingId: targetId } }),
                prisma.user.update({
                    where: { id: targetId },
                    data: { followingCount: { increment: 1 } },
                }),
                prisma.user.update({
                    where: { id: followerId },
                    data: { followingCount: { increment: 1 } }
                }),
            ]);

            return { following: true }

            // now rok jate hai
        }

        const exists = await followsRepository.exists(followerId, targetId);
        if (!exists) throw new AppError(400, "not follwoing this user");

        await prisma.$transaction([
            prisma.follow.delete({
                where: { followerId_followingId: { followerId, followingId: targetId } },
            }),

            prisma.user.update({
                where: { id: targetId },
                data: { followerCount: { decrement: 1 } }
            }),
            prisma.user.update({
                where: { id: followerId },
                data: { followingCount: { decrement: 1 } }
            })
        ]);
        return { following: false };
    },

    async getFollowers(username: string, query: FollowerQuery) {
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });
        if (!user) throw new AppError(400, "user not found")

        const rows = await followsRepository.findFollowers(user.id, {
            cursor: query.cursor,
            limit: query.limit,
        });

        const hasMore = rows.length > query.limit;
        const items = hasMore ? rows.slice(0, query.limit) : rows;

        return {
            items: items.map((r) => r.user),
            nextCursor: hasMore ? items[items.length - 1]!.id : null,
        };
    },

    async getFollowing(username: string, query: FollowerQuery) {
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });
        if (!user) throw new AppError(400, "user not found")

        const rows = await followsRepository.findFollowing(user.id, {
            cursor: query.cursor,
            limit: query.limit,
        });
        const hasMore = rows.length > query.limit;
        const items = hasMore ? rows.slice(0, query.limit) : rows;

        return {
            items: items.map((r) => r.following),
            nextCursor: hasMore ? items[items.length - 1]!.id : null,
        };

    }
}