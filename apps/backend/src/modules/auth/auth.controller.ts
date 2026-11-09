import type {Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";

export const authController = {
    async register (req : Request, res : Response, next : NextFunction) {
        try {
            const {user, token } = await
            authService.register(req.validated?.body as RegisterInput);
            res.status(201).json({user , token});
        } catch (err) {
            next(err)
        }
    },

    async login(req : Request, res : Response, next : NextFunction) {
        try {
            const {user, token } = await authService.login(req.validated?.body as LoginInput);
            res.json({user, token});

        } catch (error) {
            next(error)
        }
    },


}
