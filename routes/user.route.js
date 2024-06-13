import { Router } from "express";
import { deleteUser } from "../controllers/user.controller.js";

const router = Router();

router.get('/test', deleteUser)

// router.post('/')
// router.put('/')
// router.delete('/')

export default router