import { Router } from "express";
import {
  createpatient,
  getPatientList,
  updatepatient
} from "../controllers/patient.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  createpatient
);

router.get(
  "/",
  verifyJWT,
  getPatientList
);

router.put(
  "/:id",
  verifyJWT,
  updatepatient
);

export default router;
