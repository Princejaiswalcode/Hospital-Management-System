import { Router } from "express";
import {
  createpatient,
  getPatientList,
  updatepatient
} from "../controllers/patient.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.post(
  "/",
  verifyJWT,
  allowRoles("Admin","Reception","Doctor","Nurse"),
  createpatient
);

router.get(
  "/",
  verifyJWT,
  allowRoles("Admin","Reception"),
  getPatientList
);

router.put(
  "/:id",
  verifyJWT,
  allowRoles("Admin","Reception"),
  updatepatient
);

export default router;