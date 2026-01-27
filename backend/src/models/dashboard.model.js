import db from "../db/index.js";

export const adminDashboard=async()=>{
  const [[{totalPatients}]]=await db.execute(
    "SELECT COUNT(*)AS totalPatients FROM patients"
  );

  const [[{todayAppointments}]]=await db.execute(
    "SELECT COUNT(*)AS todayAppointments FROM appointments WHERE DATE(appointment_date)=CURDATE()"
  );

  const [[{admittedPatients}]]=await db.execute(
    "SELECT COUNT(*)AS admittedPatients FROM admissions WHERE status='Admitted'"
  );

  const [[{pendingBills}]]=await db.execute(
    "SELECT COUNT(*)AS pendingBills FROM billing WHERE status='Pending'"
  );

  const [recentPatients]=await db.execute(
    "SELECT CONCAT(first_name,' ',last_name)AS name, status FROM patients ORDER BY patient_id DESC LIMIT 3"
  );

  const [upcomingAppointments]=await db.execute(
    `SELECT CONCAT(p.first_name,' ',p.last_name)AS name, TIME(a.appointment_time)AS time
    FROM appointments a
    JOIN patients p ON a.patient_id=p.patient_id
    WHERE DATE(a.appointment_date)=CURDATE()
    ORDER BY a.appointment_time
    LIMIT 3
    `
  );

  return{
    stats:{
      totalPatients,
      todayAppointments,
      admittedPatients,
      pendingBills
   },
    lists:{
      recentPatients,
      upcomingAppointments
   }
 };
};

export const doctorDashboard=async(doctorId)=>{
  const [[{todayAppointments}]]=await db.execute(
    `SELECT COUNT(*) AS todayAppointments
    FROM appointments
    WHERE doctor_id=? AND DATE(appointment_date)=CURDATE()`,
    [doctorId]
  );

  const [[{ totalPatients }]]=await db.execute(
    `SELECT COUNT(DISTINCT patient_id) AS totalPatients
    FROM appointments
    WHERE doctor_id=?`,
    [doctorId]
  );

  const [upcomingAppointments]=await db.execute(
    `SELECT CONCAT(p.first_name,' ',p.last_name) AS name, TIME(a.appointment_time) AS time
    FROM appointments a
    JOIN patients p ON a.patient_id=p.patient_id
    WHERE a.doctor_id=? AND DATE(a.appointment_date)=CURDATE()`,
    [doctorId]
  );

  return {
    stats: {
      todayAppointments,
      totalPatients
    },
    lists: {
      upcomingAppointments
    }
  };
};

export const nurseDashboard=async()=>{
  const [[{admittedPatients}]]=await db.execute(
    "SELECT COUNT(*)AS admittedPatients FROM admissions WHERE status='Admitted'"
  );

  const [[{totalBeds}]]=await db.execute(
    "SELECT COUNT(*)AS totalBeds FROM beds"
  );

  return{
    stats:{
      admittedPatients,
      totalBeds
   }
 };
};

export const receptionDashboard=async()=>{
  const [[{totalPatients}]]=await db.execute(
    "SELECT COUNT(*)AS totalPatients FROM patients"
  );

  const [[{todayAppointments}]]=await db.execute(
    "SELECT COUNT(*)AS todayAppointments FROM appointments WHERE DATE(appointment_date)=CURDATE()"
  );

  return{
    stats:{
      totalPatients,
      todayAppointments
   }
 };
};

export const accountsDashboard=async()=>{
  const [[{pendingBills}]]=await db.execute(
    "SELECT COUNT(*)AS pendingBills FROM billing WHERE status='Pending'"
  );

  const [recentBills]=await db.execute(
    `
    SELECT CONCAT(p.first_name,' ',p.last_name)AS name, total_amount, status
    FROM billing b
    JOIN patients p ON b.patient_id=p.patient_id
    ORDER BY bill_date DESC
    LIMIT 3
    `
  );

  return{
    stats:{pendingBills},
    lists:{recentBills}
 };
};

export const patientDashboard=async(patientId)=>{
  const [[{todayAppointments}]]=await db.execute(
    `
    SELECT COUNT(*)AS todayAppointments
    FROM appointments
    WHERE patient_id=? AND DATE(appointment_date)=CURDATE()
    `,
    [patientId]
  );

  const [[{pendingBills}]]=await db.execute(
    `
    SELECT COUNT(*)AS pendingBills
    FROM billing
    WHERE patient_id=? AND status='Pending'
    `,
    [patientId]
  );

  return{
    stats:{
      todayAppointments,
      pendingBills
   }
 };
};
