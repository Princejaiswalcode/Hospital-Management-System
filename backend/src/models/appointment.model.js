import db from "../db/index.js";

export const createAppointment=async(patient_id,doctor_id,appointment_date,appointment_time,reason,status)=>{
    const query=`INSERT INTO appointments
        (patient_id,doctor_id,appointment_date,appointment_time,reason,status)
        VALUES (?, ?, ?, ?, ?, ?)`;

    const [rows]=await db.execute(query,[patient_id,doctor_id,appointment_date,appointment_time,reason,status]);
    return rows.insertId;
}

export const allAppointments=async()=>{
    const query = `
    SELECT 
      a.appointment_id AS id,
      CONCAT(p.first_name,' ',p.last_name) AS patient,
      CONCAT(d.first_name,' ',d.last_name) AS doctor,
      DATE(a.appointment_date) AS date,
      TIME(a.appointment_time) AS time,
      a.reason AS type,
      a.status
    FROM appointments a
    JOIN patients p ON a.patient_id = p.patient_id
    JOIN doctors d ON a.doctor_id = d.doctor_id
    ORDER BY a.appointment_date DESC, a.appointment_time ASC
  `;

    const [result]=await db.execute(query);
    return result;
}

export const updateAppointmentStatus=async(appointment_id,status)=>{
    const query=`UPDATE appointments 
    SET status=?
    WHERE appointment_id=?`;

    const [rows]=await db.execute(query,[status,appointment_id]);
    return rows;
}