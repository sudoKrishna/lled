import { prisma, Prisma } from "@repo/database";


const publicUser = {
    id : true , username : true, name : true , avatarUrl : true , isVerified : true
} as const;

export const likesRepository = {
    async exists(postId : string, userId : string) {
        const row = await prisma.like.findUnique({
            where : {postId_userId : {postId , userId}},
            select : {id : true}
        });
        return !! row ;
    },

    async create(postId : string, userId : string) {
        return prisma.like.create({data : {postId , userId }})
    },

    async delete(postId : string, userId : string) {
        return prisma.like.delete({
            where : {postId_userId: {postId ,userId}}
        })
    },

    async findLikers(postId : string , {cursor , limit} : {cursor? : string, limit :  number}) {
        return prisma.like.findMany({
            where : {postId},
            orderBy : {createAt : "desc"},
            take : limit * 1,
            ...(cursor ? {cursor : {id : cursor}, skip : 1} : {}),
            select : {id : true , user : {select : publicUser}}
        });
    },
};