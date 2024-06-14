import { Router } from "express";
import { deleteUser } from "../controllers/user.controller.js";
import { verifyAccessToken } from "../helpers/jwt_helpers.js";

const router = Router();

router.get('/test', deleteUser)

// router.post('/')
// router.put('/')
router.delete('/delete/:userId',verifyAccessToken,deleteUser)

export default router