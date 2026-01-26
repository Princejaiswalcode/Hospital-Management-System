import{Router}from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import{
  getBills,
  createBill,
  markBillPaid
} from "../controllers/billing.controller.js";

const router=Router();

router.get(
  "/",
  verifyJWT,
  authorizeRoles("Admin","Accounts"),
  getBills
);

router.post(
  "/",
  verifyJWT,
  authorizeRoles("Admin","Accounts"),
  createBill
);

router.put(
  "/:id/pay",
  verifyJWT,
  authorizeRoles("Admin","Accounts"),
  markBillPaid
);

export default router;
