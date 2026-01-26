import db from "../db/index.js";

/* WARD STATS */
export const fetchWardStats = async () => {
  const query = `
    SELECT 
      w.ward_name AS name,
      w.total_beds AS total,
      COUNT(a.admission_id) AS occupied
    FROM wards w
    LEFT JOIN admissions a 
      ON w.ward_id = a.ward_id 
      AND a.status = 'Active'
    GROUP BY w.ward_id
  `;

  const [rows] = await db.execute(query);
  return rows;
};

/* ADMISSION LIST */
export const fetchAdmissions = async () => {
  const query = `
    SELECT 
      CONCAT('#', p.patient_id) AS id,
      p.name,
      w.ward_name AS ward,
      a.admit_date AS admit,
      IFNULL(a.discharge_date, '-') AS discharge,
      a.status
    FROM admissions a
    JOIN patients p ON a.patient_id = p.patient_id
    JOIN wards w ON a.ward_id = w.ward_id
    ORDER BY a.admit_date DESC
  `;

  const [rows] = await db.execute(query);
  return rows;
};

/* ADMIT */
export const createAdmission = async (patient_id, ward_id, admit_date) => {
  const query = `
    INSERT INTO admissions (patient_id, ward_id, admit_date)
    VALUES (?, ?, ?)
  `;

  await db.execute(query, [patient_id, ward_id, admit_date]);
};

/* DISCHARGE */
export const dischargeAdmission = async (admission_id) => {
  const query = `
    UPDATE admissions
    SET discharge_date = CURDATE(),
        status = 'Discharged'
    WHERE admission_id = ?
  `;

  await db.execute(query, [admission_id]);
};
