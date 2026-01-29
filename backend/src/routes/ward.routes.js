import { Router } from "express";
import {
  getWardStats,
  getAdmissions,
  admitPatient,
  dischargePatient
} from "../controllers/ward.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", verifyJWT, getWardStats);
router.get("/admissions", verifyJWT, getAdmissions);

router.post(
  "/admit",
  verifyJWT,
  authorizeRoles("admin"),
  admitPatient
);

router.put(
  "/discharge/:id",
  verifyJWT,
  authorizeRoles("admin"),
  dischargePatient
);

export default router;
