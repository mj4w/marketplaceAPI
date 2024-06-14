import { Router } from "express";
import { 
    register, 
    login, 
    logout, 
    forgotPassword,
    resetPassword
} from "../controllers/auth.controller.js";

const router = Router();

router.post('/register', register)
router.post('/login', login)
router.delete('/logout', logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
// router.post('/')
// router.put('/')
// router.delete('/')

export default router