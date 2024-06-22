import { Router } from "express";
import { verifyAccessToken } from "../helpers/jwt_helpers.js";
import { createConversation, getConversation, getSingleConversation, updateConversation } from "../controllers/conversation.controller.js";

const router = Router();

router.get('/', verifyAccessToken, getConversation)
router.post('/create', verifyAccessToken, createConversation)
router.put('/:id', verifyAccessToken, updateConversation)
router.get('/single/:id', verifyAccessToken, getSingleConversation)

export default router