import { Router } from "express";
import {
  createappointment,
  getAllAppointments,
  updateStatus
} from "../controllers/appointment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  authorizeRoles("admin", "receptionist"),
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
  authorizeRoles("doctor", "admin"),
  updateStatus
);

export default router;