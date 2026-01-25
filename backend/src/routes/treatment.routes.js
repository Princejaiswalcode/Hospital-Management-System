import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.get("/", verifyJWT, getTreatments);
router.post("/", verifyJWT, createTreatment);

export default router;