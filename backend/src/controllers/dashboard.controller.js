import { asyncHandler } from "../utils/asyncHandler.js";
import {
  adminDashboard,
  doctorDashboard,
  nurseDashboard,
  receptionDashboard,
  accountsDashboard,
  patientDashboard
} from "../models/dashboard.model.js";

export const getDashboardData=asyncHandler(async(req, res)=>{
  const {role,id}=req.user;

  let data;

  switch(role){
    case "Admin":
      data = await adminDashboard();
      break;

    case "Doctor":
      data = await doctorDashboard(id);
      break;

    case "Nurse":
      data = await nurseDashboard();
      break;

    case "Reception":
      data = await receptionDashboard();
      break;

    case "Accounts":
      data = await accountsDashboard();
      break;

    case "Patient":
      data=await patientDashboard(id);
      break;

    default:
      return res.status(403).json({message:"Invalid role"});
  }
  return res.status(200).json(data);
});
