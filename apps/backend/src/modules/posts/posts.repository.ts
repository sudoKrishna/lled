import {Prisma, prisma} from "@repo/database";

const activePost : Prisma.PostWhereInput = {
    status : "ACTIVE",
    deleteAt : null
};

const feedVisible : Prisma.PostWhereInput = {
    status : "ACTIVE",
    deleteAt : null,
    visibility : "PUBLIC",
}

const authorSelect = {
    id : true,
    username : true,
    name : true,
    avatarUrl : true,
    isVerified : true,
} as const;

const postInclude = {
    media : {orderBy : {order : "asc" as const}},
    author : {select : authorSelect},
    _count : {
        select : {comments : true, likes : true , reposts : true},
    },
} satisfies Prisma.PostInclude;


export const postRepository = {
    async findById(postId : string) {
        return prisma.post.findFirst({
            where : {id : postId},
            include : postInclude,
        });
    },

    async findFeed({
        cursor,
        limit,
        authorId,
    } : {
        cursor? : string;
        limit: number;
        authorId? : string;
    }) {
        return prisma.post.findMany({
            where : {
                ...feedVisible,
                ...(authorId ? {authorId} : {})
            },
            orderBy : {createAt: "desc"},
            take : limit + 1,
            ...(cursor
                ? {cursor: {id: cursor}, skip : 1}
                : {}
            ),
            include : postInclude,
        });
    },

    async create(data : Prisma.PostCreateInput & {
        media : {create : {url : string, mediaType : string, order : number}[]};
    }) {
        return prisma.post.create({
            data, 
            include: postInclude,
        });
    },

    async update(postId : string, data : Prisma.PostUpdateInput) {
        return prisma.post.update({
            where : {id : postId},
            data, include : postInclude,
        });
    },

    async softDelete(postId : string) {
        return prisma.post.update({
            where : {id : postId},
            data :  {
                status : "DELETED",
                deleteAt : new Date(),
            },
            select : {id : true}
        });
    },

    async findManyByIds(ids : string[])  {
         return prisma.post.findMany({
            where : {id : {in : ids}, ...activePost},
            include : postInclude
         });
    },

  async incrementCounts(postId: string, data: { commentCount?: number; likeCount?: number; repostCount?: number }) {
    return prisma.post.update({
      where: { id: postId },
      data: {
        ...(data.commentCount ? { commentCount: { increment: data.commentCount } } : {}),
        ...(data.likeCount ? { likeCount: { increment: data.likeCount } } : {}),
        ...(data.repostCount ? { repostCount: { increment: data.repostCount } } : {}),
      },
      select: { id: true, commentCount: true, likeCount: true, repostCount: true },
    });
  },

    async existsActive(postId : string) {
        const post = await prisma.post.findFirst({
            where : {id : postId , ...activePost},
            select : {id : true},
        });
        return !!post;
    },
};