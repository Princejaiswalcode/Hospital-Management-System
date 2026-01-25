import { Router } from "express";
import {
  processSalary,
  getSalaryHistory
} from "../controllers/salary.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router=Router();

router.post(
  "/",
  verifyJWT,
  allowRoles("Admin","Accounts"),
  processSalary
);

router.get(
  "/history",
  verifyJWT,
  allowRoles("Admin","Accounts"),
  getSalaryHistory
);

export default router;
