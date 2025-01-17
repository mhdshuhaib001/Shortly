import express from "express";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

import authController from "../controllers/authController.js";

router.post("/google", authController.googleAuth);
router.get('/verify', authMiddleware, authController.verifyToken);


export default router;
