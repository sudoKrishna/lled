import type { ErrorRequestHandler } from "express";


export const errorHandler : ErrorRequestHandler = (
    err, req, res, _next,
) => {
    console.error(err);

    const statusCode = 
    typeof err.statusCode === "number" &&
    err.statusCode >= 400 &&
    err.statusCode < 600
    ? err.statusCode
    : 500;
    res.status(statusCode).json({
        success : false,
        error : {
            message : 
            statusCode === 500 ? "Internal server error"
             : err.message || "Request failed",
        },
    });
};
