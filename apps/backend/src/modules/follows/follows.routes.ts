import {Router} from "express";
import { requireAuth } from "../../middleware/auth.js";
import { followsController } from "./follows.controller.js";

const router  = Router();

router.post("/users/:username/follow", requireAuth , followsController.follow);
router.post("/users/:username/follow", requireAuth , followsController.unfollow);

router.get("/users/:username/followers", followsController.followers);
router.get("/users/:username/following", followsController.following);



// so done with this live seeyou in the next one ; 
