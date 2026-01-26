import {
  fetchWardStats,
  fetchAdmissions,
  createAdmission,
  dischargeAdmission
} from "../models/ward.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getWardStats = asyncHandler(async (_, res) => {
  const wards = await fetchWardStats();
  return res.status(200).json(wards);
});

const getAdmissions = asyncHandler(async (_, res) => {
  const admissions = await fetchAdmissions();
  return res.status(200).json(admissions);
});

const admitPatient = asyncHandler(async (req, res) => {
  const { patient_id, ward_id, admit_date } = req.body;

  if (!patient_id || !ward_id || !admit_date) {
    throw new ApiError(400, "All fields are required");
  }

  await createAdmission(patient_id, ward_id, admit_date);

  return res.status(201).json({
    message: "Patient admitted successfully"
  });
});

const dischargePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await dischargeAdmission(id);

  return res.status(200).json({
    message: "Patient discharged successfully"
  });
});

export {
  getWardStats,
  getAdmissions,
  admitPatient,
  dischargePatient
};
