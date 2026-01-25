import db from "../db/index.js";

export const insertPatient=async(first_name,last_name,age,gender,contact,address,status)=> {
  const query=`INSERT INTO patients
   (first_name,last_name,age,gender,contact_number,address,status)
    VALUES(?, ?, ?, ?, ?, ?, ?)`;
  await db.execute(query, [first_name,last_name,age,gender,contact,address,status]);
};

export const fetchPatients=async()=>{
  const query=`SELECT
      patient_id,
      CONCAT(first_name, ' ', last_name) AS name,
      age,
      gender,
      contact_number AS contact,
      address,
      status
    FROM patients
    ORDER BY patient_id DESC`;
  const [rows]=await db.execute(query);
  return rows;
};

export const modifyPatient=async(patient_id,first_name,last_name,contact,address,status)=>{
  const query=`UPDATE patients
    SET
      first_name=?,
      last_name=?,
      contact_number=?,
      address=?,
      status=?
    WHERE patient_id=?`;
  await db.execute(query,[first_name,last_name,contact,address,status,patient_id
  ]);
};