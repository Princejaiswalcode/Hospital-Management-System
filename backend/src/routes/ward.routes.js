import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.get("/", verifyJWT, getWards);

export default router;