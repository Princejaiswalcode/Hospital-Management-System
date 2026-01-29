import db from "../db/index.js";

/* =========================
   INSERT PATIENT
========================= */
export const insertPatient = async (
  first_name,
  last_name,
  date_of_birth,
  gender,
  contact,
  address
) => {
  const query = `
    INSERT INTO patients
      (first_name, last_name, date_of_birth, gender, phone, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await db.execute(query, [
    first_name,
    last_name,
    date_of_birth,
    gender,
    contact,
    address
  ]);
};

/* =========================
   FETCH PATIENTS (AGE CALCULATED)
========================= */
export const fetchPatients = async () => {
  const query = `
    SELECT
      patient_id,
      CONCAT(first_name, ' ', last_name) AS name,
      TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age,
      gender,
      phone AS contact,
      address
    FROM patients
    ORDER BY patient_id DESC
  `;
  const [rows] = await db.execute(query);
  return rows;
};

/* =========================
   UPDATE PATIENT
========================= */
export const modifyPatient = async (
  patient_id,
  first_name,
  last_name,
  contact,
  address
) => {
  const query = `
    UPDATE patients
    SET
      first_name = ?,
      last_name = ?,
      phone = ?,
      address = ?
    WHERE patient_id = ?
  `;
  await db.execute(query, [
    first_name,
    last_name,
    contact,
    address,
    patient_id
  ]);
};
