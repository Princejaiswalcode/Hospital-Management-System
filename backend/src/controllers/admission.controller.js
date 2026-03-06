import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import {
  fetchAllAdmissions,
  fetchAdmissionById,
  fetchAdmissionsByPatient,
  createAdmission,
  dischargePatient,
  deleteAdmission
} from "../models/admission.model.js";

/* =========================
   GET ALL
========================= */
export const getAllAdmissions = asyncHandler(async (req, res) => {
  const data = await fetchAllAdmissions();
  res.json(new ApiResponse(200, data, "Admissions fetched"));
});

/* =========================
   GET BY ID
========================= */
export const getAdmission = asyncHandler(async (req, res) => {
  const admission = await fetchAdmissionById(req.params.id);
  if (!admission) throw new ApiError(404, "Admission not found");

  res.json(new ApiResponse(200, admission));
});

/* =========================
   GET BY PATIENT
========================= */
export const getPatientAdmissions = asyncHandler(async (req, res) => {
  const data = await fetchAdmissionsByPatient(req.params.patientId);
  res.json(new ApiResponse(200, data));
});

/* =========================
   CREATE
========================= */
export const addAdmission = asyncHandler(async (req, res) => {
  const { patient_id, ward_id, admission_date } = req.body;

  if (!patient_id || !ward_id || !admission_date) {
    throw new ApiError(400, "Patient, ward and admission date are required");
  }

  const id = await createAdmission({
    patient_id: Number(patient_id),
    ward_id: Number(ward_id),
    admission_date,
    room_number: req.body.room_number || null,
    bed_number: req.body.bed_number || null,
    reason: req.body.reason || null
  });

  res.status(201).json(
    new ApiResponse(201, { admission_id: id }, "Patient admitted")
  );
});
/* =========================
   DISCHARGE
========================= */
export const discharge = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  await dischargePatient(req.params.id, today);

  res.json(new ApiResponse(200, null, "Patient discharged"));
});
/* =========================
   DELETE
========================= */
export const removeAdmission = asyncHandler(async (req, res) => {
  await deleteAdmission(req.params.id);
  res.json(new ApiResponse(200, null, "Admission deleted"));
});
