import express from "express";
import cookieParser from "cookie-parser";
import cros from 'cros';
import authRoutes from "./routes/authRoutes.routes.js";

const app=express();

app.use(cros({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/auth/login",authRoutes)

app.use("/api/admin",
  verifyJWT,
  authorizeRoles("Admin"),
  adminRoutes
);

app.use("/api/doctor",
  verifyJWT,
  authorizeRoles("Doctor"),
  doctorRoutes
);


export {app}