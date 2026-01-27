import {
  insertTreatment,
  fetchTreatments
} from "../models/treatment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addTreatment=asyncHandler(async(req,res)=>{
  const { appointment_id,diagnosis,medicines }=req.body;

  if(!appointment_id)
    throw new ApiError(400,"Appointment is required");

  if(!diagnosis || !medicines)
    throw new ApiError(400,"Diagnosis and medicines required");

  await insertTreatment(
    appointment_id,
    diagnosis,
    medicines,
    req.user.id
  );

  return res.status(201).json({
    message: "Treatment added successfully"
  });
});

const getAllTreatments=asyncHandler(async(_,res)=>{
  const treatments=await fetchTreatments();

  return res.status(200).json(treatments);
});

export {
  addTreatment,
  getAllTreatments
};
