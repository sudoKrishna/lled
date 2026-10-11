import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { userController } from "./users.controller.js";

const router: Router = Router();

router.get("/users/me", requireAuth, userController.getMe);
router.patch("/users/me" , requireAuth, userController.updateMe);
router.patch("/users/me/password", requireAuth, userController.changePassword);
router.get("/users/search", requireAuth, userController.search);
router.get("/users/:username", userController.getUser);
router.get("/users/:username/posts", userController.getUserPosts);

export default router;
