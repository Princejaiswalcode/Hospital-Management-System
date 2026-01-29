import {
  insertPatient,
  fetchPatients,
  modifyPatient
} from "../models/patient.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const calculateDOBFromAge = (age) => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - age);
  return today.toISOString().split("T")[0];
};

const createpatient = asyncHandler(async (req, res) => {
  const { name, age, gender, contact, address } = req.body;

  if (!name || !name.trim()) throw new ApiError(400, "Name is required");
  if (!age || age <= 0 || age > 120) throw new ApiError(400, "Invalid age");
  if (!gender) throw new ApiError(400, "Gender required");
  if (!contact) throw new ApiError(400, "Contact required");
  if (!address) throw new ApiError(400, "Address required");

  const [first_name, ...rest] = name.trim().split(" ");
  const last_name = rest.join(" ") || "";

  const date_of_birth = calculateDOBFromAge(age);

  await insertPatient(
    first_name,
    last_name,
    date_of_birth,
    gender,
    contact,
    address
  );

  return res.status(201).json({ message: "Patient created" });
});


const getPatientList = asyncHandler(async (req, res) => {
  const patients = await fetchPatients();
  return res.status(200).json(patients);
});

const updatepatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, contact, address } = req.body;

  if (!id) throw new ApiError(400, "Patient ID required");

  const [first_name, ...rest] = name.trim().split(" ");
  const last_name = rest.join(" ") || "";

  await modifyPatient(id, first_name, last_name, contact, address);

  return res.status(200).json({ message: "Patient updated" });
});

export {
  createpatient,
  getPatientList,
  updatepatient
};