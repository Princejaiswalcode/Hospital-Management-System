import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";

const router = Router();

router.get(
  "/",
  verifyJWT,
  getDashboardData
);

export default router;
