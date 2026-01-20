import { Router } from "express";
import {
  createappointment,
  getAllAppointments,
  updateStatus
} from "../controllers/appointment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  createappointment
);

router.get(
  "/",
  verifyJWT,
  getAllAppointments
);

router.patch(
  "/:id",
  verifyJWT,
  updateStatus
);

export default router;
