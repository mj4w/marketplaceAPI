import { Router } from "express";
import { verifyAccessToken } from "../helpers/jwt_helpers.js";
import { createOrder, getOrders } from "../controllers/order.controller.js";

const router = Router();

router.post('/:id', verifyAccessToken, createOrder)
router.get('/', verifyAccessToken, getOrders)

export default router