import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.get("/", verifyJWT, getBills);
router.post("/", verifyJWT, createBill);
router.put("/:id/pay", verifyJWT, markBillPaid);

export default router;