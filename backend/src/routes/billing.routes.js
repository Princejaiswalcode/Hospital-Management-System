import{Router}from "express";
import{verifyJWT}from "../middlewares/auth.middleware.js";
import{allowRoles}from "../middlewares/role.middleware.js";
import{
  getBills,
  createBill,
  markBillPaid
} from "../controllers/billing.controller.js";

const router=Router();

router.get(
  "/",
  verifyJWT,
  allowRoles("Admin","Accounts"),
  getBills
);

router.post(
  "/",
  verifyJWT,
  allowRoles("Admin","Accounts"),
  createBill
);

router.put(
  "/:id/pay",
  verifyJWT,
  allowRoles("Admin","Accounts"),
  markBillPaid
);

export default router;
