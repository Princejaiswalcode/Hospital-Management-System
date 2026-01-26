import { Router } from "express";
import {
  createpatient,
  getPatientList,
  updatepatient
} from "../controllers/patient.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router=Router();

router.post(
  "/",
  verifyJWT,
  authorizeRoles("Admin","Reception","Doctor","Nurse"),
  createpatient
);

router.get(
  "/",
  verifyJWT,
  authorizeRoles("Admin","Reception"),
  getPatientList
);

router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("Admin","Reception"),
  updatepatient
);

export default router;