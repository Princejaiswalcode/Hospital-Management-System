import db from "../db/index.js";

export const insertTreatment = async (
  appointment_id,
  diagnosis,
  medicines,
  treated_by
) => {
  const query = `
    INSERT INTO treatments
    (appointment_id, diagnosis, medicines, treated_by)
    VALUES (?, ?, ?, ?)
  `;

  await db.execute(query, [
    appointment_id,
    diagnosis,
    medicines,
    treated_by
  ]);
};

export const fetchTreatments = async () => {
  const query = `
    SELECT 
      CONCAT('#', p.patient_id) AS patientId,
      p.name AS patientName,
      t.diagnosis,
      t.medicines,
      DATE(t.created_at) AS date
    FROM treatments t
    JOIN appointments a ON t.appointment_id = a.appointment_id
    JOIN patients p ON a.patient_id = p.patient_id
    ORDER BY t.created_at DESC
  `;

  const [rows] = await db.execute(query);
  return rows;
};
