import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";

import { verifyJWT } from "./middlewares/auth.middleware.js";

const app=express();

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/dashboard",verifyJWT,dashboardRoutes);
app.use("/api/patients",verifyJWT,patientRoutes);
app.use("/api/doctors",verifyJWT,doctorRoutes);
app.use("/api/appointments",verifyJWT,appointmentRoutes);

export { app };
