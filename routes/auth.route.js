import { Router } from "express";
import { 
    register, 
    login, 
    logout 
} from "../controllers/auth.controller.js";

const router = Router();

router.post('/register', register)
router.post('/login', login)
router.delete('/logout', logout)
// router.post('/')
// router.put('/')
// router.delete('/')

export default router