import express, { type Express } from "express";
import { healthRouter } from "./routes/health.js";
import authRouter from "./modules/auth/auth.routes.js";
import usersRouter from "./modules/users/users.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app: Express = express();

app.use(express.json());

app.use(healthRouter);
app.use(authRouter);
app.use(usersRouter);

app.use(errorHandler);
