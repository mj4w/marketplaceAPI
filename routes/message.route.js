import { Router } from "express";
import { verifyAccessToken } from "../helpers/jwt_helpers.js";
import { createMessage, getMessages } from "../controllers/message.controller.js";

const router = Router();

router.get('/:id', verifyAccessToken, getMessages)
router.post('/create', verifyAccessToken, createMessage)
// router.post('/')
// router.put('/')
// router.delete('/')

export default router