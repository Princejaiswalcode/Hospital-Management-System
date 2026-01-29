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
  authorizeRoles("admin","reception","doctor","nurse"),
  createpatient
);

router.get(
  "/",
  verifyJWT,
  authorizeRoles("admin","reception"),
  getPatientList
);

router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("admin","reception"),
  updatepatient
);

export default router;