import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  createTreatment,
  getTreatmentsByPatient,
  getTreatmentsByDoctor,
  getAllTreatments
} from "../models/treatment.model.js";

import { getDoctorByUserId } from "../models/doctor.model.js";
import { getPatientByUserId } from "../models/patient.model.js";

/* =========================
   ADD TREATMENT (DOCTOR)
========================= */
export const addTreatment = asyncHandler(async (req, res) => {
  const { user_id, role } = req.user;

  // ✅ Allow doctor AND admin
  if (!["doctor", "admin"].includes(role)) {
    throw new ApiError(403, "Not allowed to add treatment");
  }

  let doctor_id;

  if (role === "doctor") {
    const doctor = await getDoctorByUserId(user_id);
    if (!doctor) {
      throw new ApiError(404, "Doctor profile not found");
    }
    doctor_id = doctor.doctor_id;
  }

  // ✅ Admin must explicitly send doctor_id
  if (role === "admin") {
    doctor_id = req.body.doctor_id;
    if (!doctor_id) {
      throw new ApiError(400, "doctor_id is required for admin");
    }
  }

  const { appointment_id, patient_id, diagnosis, medicines } = req.body;

  if (!appointment_id || !patient_id || !diagnosis || !medicines) {
    throw new ApiError(400, "Missing required fields");
  }

  const treatmentId = await createTreatment({
    appointment_id,
    patient_id,
    doctor_id,
    diagnosis,
    medicines
  });

  res.status(201).json(
    new ApiResponse(201, { treatment_id: treatmentId }, "Treatment added")
  );
});


/* =========================
   DOCTOR TREATMENTS
========================= */
export const getDoctorTreatments = asyncHandler(async (req, res) => {
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Forbidden");
  }

  const doctor = await getDoctorByUserId(req.user.user_id);
  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found");
  }

  const treatments = await getTreatmentsByDoctor(doctor.doctor_id);
  res.json(new ApiResponse(200, treatments, "Doctor treatments"));
});

/* =========================
   PATIENT TREATMENTS
========================= */
export const getMyTreatments = asyncHandler(async (req, res) => {
  if (req.user.role !== "patient") {
    throw new ApiError(403, "Forbidden");
  }

  const patient = await getPatientByUserId(req.user.user_id);
  if (!patient) {
    throw new ApiError(404, "Patient profile not found");
  }

  const treatments = await getTreatmentsByPatient(patient.patient_id);
  res.json(new ApiResponse(200, treatments, "Patient treatments"));
});

/* =========================
   ADMIN – ALL TREATMENTS
========================= */
export const getAllTreatmentsController = asyncHandler(async (req, res) => {

  if (!["admin", "nurse"].includes(req.user.role)) {
    throw new ApiError(403, "Forbidden");
  }

  const treatments = await getAllTreatments();

  res.json(new ApiResponse(200, treatments, "All treatments"));
});
