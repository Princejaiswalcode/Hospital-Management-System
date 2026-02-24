import { Router } from "express";
import {
  addTreatment,
  getMyTreatments,
  getDoctorTreatments,
  getAllTreatmentsController
} from "../controllers/treatment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, addTreatment);
router.get("/my", verifyJWT, getMyTreatments);
router.get("/doctor", verifyJWT, getDoctorTreatments);
router.get("/all", verifyJWT, getAllTreatmentsController);

export default router;
