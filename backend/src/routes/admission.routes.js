import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.get("/", verifyJWT, getAdmissions);
router.post("/", verifyJWT, admitPatient);
router.put("/:id/discharge", verifyJWT, dischargePatient);

export default router;