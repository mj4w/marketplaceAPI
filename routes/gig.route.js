import { Router } from "express";
import { homeGig } from "../controllers/gig.controller.js";
import { verifyAccessToken } from "../helpers/jwt_helpers.js";

const router = Router();

router.get('/home',verifyAccessToken,homeGig)
// router.post('/')
// router.put('/')
// router.delete('/')

export default router