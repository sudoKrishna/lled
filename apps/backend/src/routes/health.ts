import { Router } from "express";
import { prisma } from "@repo/database";

export const healthRouter: Router = Router();


healthRouter.get("/health", (_req, res) => {
res.status(200).json({
    status : "ok",
    service : "lled-backend",
    timestamp : new Date().toISOString(),
})
})

healthRouter.get("/ready", async (_req, res) => {
   try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
        status : "ready",
        database : "up",
        timestamp : new Date().toISOString(),
    });
   } catch (err) {
    console.error("readiness check failed : database unreaable", err);

    res.status(503).json({
        status : "unavaliable",
        database : "down",
        timestamp : new Date().toISOString(),
    })
   }
})

export default healthRouter;