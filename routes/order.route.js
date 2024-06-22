import { Router } from "express";
import { verifyAccessToken } from "../helpers/jwt_helpers.js";
import { createOrder, deleteOrder, getOrders } from "../controllers/order.controller.js";

const router = Router();

router.post('/:id', verifyAccessToken, createOrder)
router.get('/', verifyAccessToken, getOrders)
router.delete('/:id', verifyAccessToken, deleteOrder)

export default router