import { Router } from "express";
import {
  getDashboardStats,
  getTodayAppointments,
  getRecentPatients
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.get("/stats", verifyJWT, getDashboardStats);
router.get("/appointments", verifyJWT, getTodayAppointments);
router.get("/patients", verifyJWT, getRecentPatients);

export default router;