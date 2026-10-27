import express from "express"
import { register,login, refreshAccessToken, checkNewLogin } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router=express.Router();
router.post("/auth/register",register);
router.post("/auth/login",login)
router.post("/refresh",refreshAccessToken);
router.get("/auth/new-login",auth,checkNewLogin)

export default router;
