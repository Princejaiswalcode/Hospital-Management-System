import { db } from "../db/index.js";

/* =========================
   FETCH
========================= */

export const fetchAllAdmissions = async () => {
  const [rows] = await db.execute(`
    SELECT
      a.admission_id,
      a.admission_date,
      a.discharge_date,
      a.room_number,
      a.bed_number,
      a.reason,
      p.patient_id,
      CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
      w.ward_name,
      w.ward_type
    FROM admissions a
    JOIN patients p ON a.patient_id = p.patient_id
    JOIN wards w ON a.ward_id = w.ward_id
    ORDER BY a.admission_date DESC
  `);
  return rows;
};

export const fetchAdmissionById = async (id) => {
  const [[row]] = await db.execute(
    `SELECT * FROM admissions WHERE admission_id = ?`,
    [id]
  );
  return row;
};

export const fetchAdmissionsByPatient = async (patient_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM admissions WHERE patient_id = ?`,
    [patient_id]
  );
  return rows;
};

/* =========================
   CREATE
========================= */

export const createAdmission = async (data) => {
  const {
    patient_id,
    ward_id,
    admission_date,
    room_number,
    bed_number,
    reason
  } = data;

  // ✅ 1. CHECK AVAILABLE BEDS
  const [[ward]] = await db.execute(
    `SELECT available_beds FROM wards WHERE ward_id = ?`,
    [ward_id]
  );

  if (!ward || ward.available_beds <= 0) {
    throw new Error("No beds available in this ward");
  }

  // ✅ 2. INSERT ADMISSION
  const [result] = await db.execute(
    `INSERT INTO admissions
     (patient_id, ward_id, admission_date, room_number, bed_number, reason)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      patient_id,
      ward_id,
      admission_date,
      room_number,
      bed_number,
      reason
    ]
  );

  // ✅ 3. DECREASE AVAILABLE BEDS
  await db.execute(
    `UPDATE wards
     SET available_beds = available_beds - 1
     WHERE ward_id = ?`,
    [ward_id]
  );

  return result.insertId;
};

/* =========================
   DISCHARGE
========================= */

export const dischargePatient = async (id, discharge_date) => {

  // ✅ 1. GET WARD ID FIRST
  const [[admission]] = await db.execute(
    `SELECT ward_id FROM admissions WHERE admission_id = ?`,
    [id]
  );

  if (!admission) {
    throw new Error("Admission not found");
  }

  // ✅ 2. UPDATE DISCHARGE DATE
  await db.execute(
    `UPDATE admissions
     SET discharge_date = ?
     WHERE admission_id = ?`,
    [discharge_date, id]
  );

  // ✅ 3. INCREASE AVAILABLE BEDS
  await db.execute(
    `UPDATE wards
     SET available_beds = available_beds + 1
     WHERE ward_id = ?`,
    [admission.ward_id]
  );
};

/* =========================
   DELETE
========================= */

export const deleteAdmission = async (id) => {
  await db.execute(
    `DELETE FROM admissions WHERE admission_id = ?`,
    [id]
  );
};
