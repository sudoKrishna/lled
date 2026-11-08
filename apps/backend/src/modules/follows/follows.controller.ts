// wait relax thats why dont see the reels 

import { NextFunction, Request, Response } from "express";
import { followersQuerySchema, usernameParamSchema } from "./follows.validation.js";
import { followsService } from "./follows.service.js";

export const followsController = {
    async follow(req : Request, res : Response , next : NextFunction) {
        try {
            const {username} = usernameParamSchema.parse(req.params);
            const result = await followsService.follow(req.userId!, username);
            res.json(result);
        } catch (error) {
            next(error)
        }
    },


    async unfollow(req: Request, res : Response, next : NextFunction) {
        try {
            const {username } = usernameParamSchema.parse(req.params);
            const result = await followsService.unfollow(req.userId!, username);
            res.json(result);
        } catch (err) {
            next(err)
        }
    },

    async followers(req : Request, res: Response, next : NextFunction) {
        try {
            const {username} = usernameParamSchema.parse(req.params);
            const query = followersQuerySchema.parse(req.query);
            const result = await followsService.getFollowers(username ,query);
            res.json(result);
        } catch (error) {
            next(error); 
        }
    },

    async following(req : Request , res : Response, next : NextFunction) {
        try {
            const {username} = usernameParamSchema.parse(req.params);
            const query = followersQuerySchema.parse(req.query);
            const result = await followsService.getFollowing(username , query);
            res.json(result);
        } catch (error) {
            next(error)
        }
    }
} 