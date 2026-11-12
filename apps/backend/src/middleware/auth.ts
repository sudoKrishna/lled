import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "./error-handler.js";
import { env } from "../config/env.js";

export function requireAuth(req: Request, res : Response, next: NextFunction) {
    const header = req.headers.authorization;
    if(!header?.startsWith("Bearer ")) {
        return next(new AppError(401, "Missing token"));
    }

    try {
        const payload = jwt.verify(header.slice(7) , env.JWT_SECRET);
        req.userId = (payload as jwt.JwtPayload).sub;
        next();
    } catch (error) {
        next(new AppError(401, "Invalid or expired token"));
    }
}
