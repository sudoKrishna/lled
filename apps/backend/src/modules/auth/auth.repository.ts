import {prisma} from "@repo/database"
import type { Prisma } from "@repo/database"

export const publicUser = {
    id : true , email : true, username : true , name : true, bio: true,
    avatarUrl : true, isVerified : true, followerCount : true, followingCount : true, createdAt:  true,
} as const;

export const authRepository = {
    async findByEmail(email : string) {
        return prisma.user.findUnique({where : {email}})
    },

    async findByUsername(username : string) {
        return prisma.user.findUnique({where : {username}})
    },

    async findByIdentifier(identifier : string) {
        return prisma.user.findFirst({
            where : {OR : [{email : identifier}, {username : identifier}]},
        });
    },

    async createUser(data : Prisma.UserCreateInput) {
        return prisma.user.create({data, select : publicUser})
    },
};

