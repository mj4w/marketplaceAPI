import { Router } from "express";
import { createGig, deleteGig, getAllGig, getGig, updateGig } from "../controllers/gig.controller.js";
import { verifyAccessToken, verifyRefreshToken } from "../helpers/jwt_helpers.js";

const router = Router();

router.post('/create',verifyAccessToken, createGig)
router.get('/', getAllGig)
router.get('/single/:id', getGig)
router.delete('/:id', verifyAccessToken, deleteGig)
router.put('/:id', verifyAccessToken, updateGig)

export default router