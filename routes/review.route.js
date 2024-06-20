import { Router } from "express";
import { verifyAccessToken } from "../helpers/jwt_helpers.js";
import { createReview, deleteReview, getReviews, updateReview } from "../controllers/review.controller.js";

const router = Router();

router.post('/create', verifyAccessToken, createReview)
router.get('/:id', verifyAccessToken, getReviews)
router.delete('/:id', verifyAccessToken, deleteReview)
router.put('/:id', verifyAccessToken, updateReview)
// router.post('/')
// router.put('/')
// router.delete('/')

export default router