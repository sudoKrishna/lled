import { prisma, Prisma } from "@repo/database";
import { publicUser } from "../auth/auth.repository.js";

/**
 * kya karna hai 
 * follow
 * exists mean ek dosre ko follow karte hai 
 * 
 * create follow
 * delete follow
 * find follower
 * find following user 
 * follower count
 * 
 * 
 * 
 */

export const followsRepository = {
    async exists(followerId : string, followingId : string) {
        const row = await prisma.follow.findUnique({
            where : {followerId_followingId : {followerId, followingId}},
            select : {id : true}
        });
        return row;
    },

    async create(followerId: string, followingId : string) {
        return prisma.follow.create({data: {followerId, followingId}});
    },

    async delete(followerId : string, followingId :string) {
        return prisma.follow.delete({where : {followerId_followingId : {followerId, followingId}},
        });
    },

    async findFollowers(userId : string, {cursor , limit}: {cursor?: string, limit: number}) {
        return prisma.follow.findMany({
            where : {followingId : userId},
            orderBy : {createdAt : "desc"},
            take : limit + 1,
            ...(cursor ? {cursor : {id : cursor}, skip  : 1} : {}),
            select : {id : true, user : {select : publicUser}},
        })
    },

    async findFollowing(userId : string, {cursor , limit} : {cursor? : string, limit : number}) {
        return prisma.follow.findMany({
            where : {followerId :userId},
            orderBy : {createdAt : "desc"},
            take : limit + 1,
            ...(cursor ?  {cursor : {id : cursor}, skip : 1} : {}), 
            select : {id : true, following : {select : publicUser}}
        })
    },

    async countFollowers(userId: string) {
        return prisma.follow.count({where : {followingId : userId}});
    },
}