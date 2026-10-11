import {prisma} from "@repo/database"
import type { Prisma } from "@repo/database"
import { publicUser } from "../auth/auth.repository.js"

type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUser }>;

export const usersRepository = {
    findByusername(username : string): Promise<PublicUser | null> {
        return prisma.user.findUnique({where : {username} ,select : publicUser});
    },

    findById(id : string): Promise<PublicUser | null> {
        return prisma.user.findUnique({where : {id}, select : publicUser});
    },

    update(id : string, data: Prisma.UserUpdateInput): Promise<PublicUser> {
        return prisma.user.update({where : {id}, data, select : publicUser});
    },

    search(q: string, limit = 10): Promise<PublicUser[]> {
        return prisma.user.findMany({
            where : {
                OR : [{username : {contains: q, mode : "insensitive"}},
                       {name : {contains :q, mode : "insensitive"}}],
            },
            select : publicUser,
            take : limit,
        });
    },
};
