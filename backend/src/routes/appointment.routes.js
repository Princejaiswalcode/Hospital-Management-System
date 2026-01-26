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
  authorizeRoles("Admin", "Receptionist"),
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
  authorizeRoles("Doctor", "Admin"),
  updateStatus
);

export default router;