import db from "../db/index.js";

export const insertTreatment=async(
  appointment_id,
  diagnosis,
  medicines,
  treated_by)=>{
  const query=`INSERT INTO treatments
   (patient_id, doctor_id, treatment_date, diagnosis, prescription)
    VALUES (?, ?, CURDATE(), ?, ?)`

  await db.execute(query,[
    appointment_id,
    diagnosis,
    medicines,
    treated_by
  ]);
};

export const fetchTreatments=async()=>{
  const query=`SELECT
      CONCAT('#', p.patient_id) AS patientId,
      CONCAT(p.first_name,' ',p.last_name) AS patientName,
      CONCAT(d.first_name,' ',d.last_name) AS doctorName,
      t.diagnosis,
      t.prescription,
      DATE(t.treatment_date) AS date
    FROM treatments t
    JOIN patients p ON t.patient_id = p.patient_id
    JOIN doctors d ON t.doctor_id = d.doctor_id
    ORDER BY t.treatment_date DESC
  `;

  const [rows]=await db.execute(query);
  return rows;
};
