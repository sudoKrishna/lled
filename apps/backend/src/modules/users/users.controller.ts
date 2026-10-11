import type { Request, Response, NextFunction } from "express";
import { userService } from "./users.service.js";
import { usernameParamSchema, updateMeSchema, changePasswordSchema, feedQuerySchema } from "./users.validation.js";

export const userController  = {
    async getUser (req : Request, res :Response , next : NextFunction)  {
        try {
            const { params } = usernameParamSchema.parse({ params: req.params });
            const profile = await userService.getProfile(params.username , req.userId);
            res.json({
                user : profile
            });
        } catch (err) {
            next(err)
        }
    },

    async getMe(req : Request, res : Response , next : NextFunction) {
        try {
            const user = await userService.getMe(req.userId!) //
            res.json({user})
        } catch (error) {
            next(error)
        }
    },

    async updateMe(req : Request, res : Response , next : NextFunction) {
        try {
            const input = updateMeSchema.parse(req.body);
            const user = await userService.updateMe(req.userId!, input);
            res.json({user})
        } catch (error) {
            next(error);
        }
    },

    async changePassword(req : Request, res : Response, next :NextFunction) {
        try {
            const input = changePasswordSchema.parse(req.body);
            const result = await userService.changePassword(req.userId!, input);
            res.json(result);
        } catch (error) {
            next(error)
        }
    },

    async search(req : Request, res :Response , next : NextFunction) {
        try {
            const q = typeof req.query.q === "string" ? req.query.q : "";
            const limit = feedQuerySchema.parse(req.query).limit ?? 10;
            const users = await userService.search(q, limit);
            res.json({users});
        } catch (error) {
            next(error)
        }
    },

    async getUserPosts(req : Request, res :Response , next : NextFunction) {
        try {
            const { params } = usernameParamSchema.parse({ params: req.params });
            const query = feedQuerySchema.parse(req.query);
            const feed = await userService.getUserPosts(params.username, query);
            res.json(feed);
        } catch (error) {
            next(error)
        }
    },
}
