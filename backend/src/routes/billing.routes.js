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
  authorizeRoles("admin","accounts"),
  getBills
);

router.post(
  "/",
  verifyJWT,
  authorizeRoles("admin","accounts"),
  createBill
);

router.put(
  "/:id/pay",
  verifyJWT,
  authorizeRoles("admin","accounts"),
  markBillPaid
);

export default router;
