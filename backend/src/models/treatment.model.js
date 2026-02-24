import { db } from "../db/index.js";

/* CREATE */
export const createTreatment = async ({
  appointment_id,
  patient_id,
  doctor_id,
  diagnosis,
  medicines
}) => {
  const [result] = await db.execute(
    `INSERT INTO treatments
     (appointment_id, patient_id, doctor_id, diagnosis, prescription, treatment_date)
     VALUES (?, ?, ?, ?, ?, CURDATE())`,
    [appointment_id, patient_id, doctor_id, diagnosis, medicines]
  );

  return result.insertId;
};

/* PATIENT */
export const getTreatmentsByPatient = async (patient_id) => {
  const [rows] = await db.execute(
    `SELECT 
        t.treatment_id,
        t.treatment_date,
        t.diagnosis,
        t.prescription,
        CONCAT(d.first_name,' ',d.last_name) AS doctor_name,
        p.patient_id,
        CONCAT(p.first_name,' ',p.last_name) AS patient_name
     FROM treatments t
     JOIN doctors d ON d.doctor_id = t.doctor_id
     JOIN patients p ON p.patient_id = t.patient_id
     WHERE t.patient_id = ?
     ORDER BY t.treatment_date DESC`,
    [patient_id]
  );

  return rows;
};

/* DOCTOR */
export const getTreatmentsByDoctor = async (doctor_id) => {
  const [rows] = await db.execute(
    `SELECT 
        t.treatment_id,
        t.treatment_date,
        t.diagnosis,
        t.prescription,
        p.patient_id,
        CONCAT(p.first_name,' ',p.last_name) AS patient_name,
        CONCAT(d.first_name,' ',d.last_name) AS doctor_name
     FROM treatments t
     JOIN patients p ON p.patient_id = t.patient_id
     JOIN doctors d ON d.doctor_id = t.doctor_id
     WHERE t.doctor_id = ?
     ORDER BY t.treatment_date DESC`,
    [doctor_id]
  );

  return rows;
};

/* ADMIN */
export const getAllTreatments = async () => {
  const [rows] = await db.execute(
    `SELECT 
        t.treatment_id,
        t.treatment_date,
        t.diagnosis,
        t.prescription,
        p.patient_id,
        CONCAT(p.first_name,' ',p.last_name) AS patient_name,
        CONCAT(d.first_name,' ',d.last_name) AS doctor_name
     FROM treatments t
     JOIN patients p ON p.patient_id = t.patient_id
     JOIN doctors d ON d.doctor_id = t.doctor_id
     ORDER BY t.treatment_date DESC`
  );

  return rows;
};
