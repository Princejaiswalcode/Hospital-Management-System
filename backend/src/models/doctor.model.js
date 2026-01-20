import db from '../db/index.js';

export const createDoctor=async(first_name,last_name,specialization,phone_number,email)=>{
    const query=`INSERT INTO doctors
        (first_name, last_name, specialization, phone_number, email)
        VALUES (?, ?, ?, ?, ?)`;
    
    const doctor=await db.execute(query,[first_name,last_name,specialization,phone_number,email]);
    return doctor.insertId;
}

export const getDoctorList=async()=>{
    const query=`SELECT id,CONCAT('Dr. ',first_name,' ',last_name) AS name,
      specialization,
      phone_number,
      email
    FROM doctors`;

    const [result]=await db.execute(query);
    return result;
}