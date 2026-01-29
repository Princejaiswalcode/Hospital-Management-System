import {
  insertTreatment,
  fetchTreatments
} from "../models/treatment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addTreatment=asyncHandler(async(req,res)=>{
  const { patient_id,diagnosis,medicines }=req.body;

  if(!patient_id)
    throw new ApiError(400,"patient is required");

  if(!diagnosis || !medicines)
    throw new ApiError(400,"Diagnosis and medicines required");

  const doctor_id = req.user.id;

  await insertTreatment(
    patient_id,
    doctor_id,//problem
    diagnosis,
    medicines
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
