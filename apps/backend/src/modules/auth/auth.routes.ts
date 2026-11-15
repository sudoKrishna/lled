import { Router } from "express";
import {validate} from "../../middleware/validate.js";
import { authController } from "./auth.controller.js";
import { registerSchema , loginSchema } from "./auth.validation.js";

const router: Router = Router();

router.post("/auth/register", validate(registerSchema), authController.register);
router.post("/auth/login", validate(loginSchema), authController.login);


export default router;
