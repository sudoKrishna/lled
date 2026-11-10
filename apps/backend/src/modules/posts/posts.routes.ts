import { Router } from "express";
import { postsController } from "./posts.controller.js";
import { requireAuth } from "../../middleware/auth.js";


const router = Router();

router.get("/posts", postsController.getFeed);
router.get("/posts/:postId", postsController.getOne);

router.post("/posts", requireAuth , postsController.create);
router.patch("/posts/:postId", requireAuth, postsController.update);
router.delete("/posts/:postId", requireAuth, postsController.remove);

// one done and it take 2 hour so i share the github also but i create more live 
// steam so in the second we wrap more also 

// now moveing to the follows section 