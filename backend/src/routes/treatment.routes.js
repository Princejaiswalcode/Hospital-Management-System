import { Router } from "express";
import {
  addTreatment,
  getAllTreatments
} from "../controllers/treatment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", verifyJWT, getAllTreatments);

router.post(
  "/",
  verifyJWT,
  authorizeRoles("Admin", "Doctor"),
  addTreatment
);

export default router;
