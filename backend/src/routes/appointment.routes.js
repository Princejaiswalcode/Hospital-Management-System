import { Router } from "express";
import {
  createappointment,
  todaysAppointments,
  updateStatus
} from "../controllers/appointment.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  createappointment
);

router.get(
  "/",
  verifyJWT,
  todaysAppointments
);

router.patch(
  "/:id",
  verifyJWT,
  updateStatus
);

export default router;
