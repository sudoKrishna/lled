import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "./error-handler.js";

export function validate(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!result.success) {
            return next(new AppError(400, result.error.message));
        }

        req.validated = result.data as typeof req.validated;
        next();
    };
}
