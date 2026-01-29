import { Router } from "express";
import {
  processSalary,
  getSalaryHistory
} from "../controllers/salary.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router=Router();

router.post(
  "/",
  verifyJWT,
  authorizeRoles("admin","accounts"),
  processSalary
);

router.get(
  "/history",
  verifyJWT,
  authorizeRoles("admin","accounts"),
  getSalaryHistory
);

export default router;
