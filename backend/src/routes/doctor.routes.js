import { Router } from "express";
import {
  createdoctor,
  getListOfDoctors
} from "../controllers/doctor.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  createdoctor
);

router.get(
  "/",
  verifyJWT,
  getListOfDoctors
);

export default router;
