import db from "../db/index.js";

export const fetchWardStats=async()=>{
  const query=`SELECT 
      w.ward_name AS name,
      w.total_beds AS total,
      COUNT(a.admission_id) AS occupied
    FROM wards w
    LEFT JOIN admissions a 
      ON w.ward_id = a.ward_id 
      AND a.discharge_date IS NULL
    GROUP BY w.ward_id`;

  const [rows]=await db.execute(query);
  return rows;
};

export const fetchAdmissions = async () => {
  const query = `
    SELECT 
      CONCAT('#', p.patient_id) AS id,
      CONCAT(p.first_name, ' ', p.last_name) AS name,
      w.ward_name AS ward,
      a.admission_date AS admit,
      IFNULL(a.discharge_date,'-') AS discharge,
      IF(a.discharge_date IS NULL, 'Active', 'Discharged') AS status
    FROM admissions a
    JOIN patients p ON a.patient_id = p.patient_id
    JOIN wards w ON a.ward_id = w.ward_id
    ORDER BY a.admission_date DESC
  `;

  const [rows] = await db.execute(query);
  return rows;
};


export const createAdmission=async(patient_id,ward_id,admission_date)=>{
  const query=`INSERT INTO admissions(patient_id,ward_id,admission_date)
    VALUES(?,?,?)`;

  await db.execute(query,[patient_id,ward_id,admission_date]);
};

export const dischargeAdmission=async(admission_id)=>{
  const query=`UPDATE admissions
    SET discharge_date=CURDATE(),
        status='Discharged'
    WHERE admission_id=?
  `;

  await db.execute(query,[admission_id]);
};
