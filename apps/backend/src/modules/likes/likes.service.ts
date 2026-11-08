import { prisma, Prisma } from "@repo/database";
import { AppError } from "../../middleware/error-handler.js";
import { likesRepository } from "./likes.repository.js";
import { LikesQuery } from "./likes.validation.js";
import { postRepository } from "../posts/posts.repository.js";

export const likesService = {
    async like(userId : string , postId : string) {
        const exists = await postRepository.existsActive(postId);
        if(!exists) throw new AppError(404, "post not found");

        const already = await likesRepository.exists(postId,  userId);
        if(already)  throw new AppError(409, "already liked");

        await prisma.$transaction([
            prisma.like.create({data : {postId, userId}}),
            prisma.post.update({
                where : {id : postId},
                data : {likeCount : {increment : 1}},
            }),

        ]);

        return {liked : true};
    },

    async unlike(userId : string, postId : string) {
      const exists = await postRepository.existsActive(postId);
      if(!exists) throw new AppError(409 , "Not liked");

      await  
    }

}