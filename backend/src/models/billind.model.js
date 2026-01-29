import db from "../db/index.js";

export const fetchAllBills=async()=>{
  const query=`
    SELECT
      b.bill_id AS id,
      b.patient_id,
      CONCAT(p.first_name,' ', p.last_name) AS patient_name,
      b.consultation_charge AS consultation,
      b.medicine_charge AS medicine,
      b.room_charge AS room,
      b.total_amount AS total,
      DATE(b.bill_date) AS date,
      b.status
    FROM bills b
    JOIN patients p ON b.patient_id=p.patient_id
    ORDER BY b.bill_date DESC
  `;

  const [rows]=await db.execute(query);
  return rows;
};

export const insertBill=async(
  patient_id,
  consultation,
  medicine,
  room,
  total
)=>{
  const query=`
    INSERT INTO bills
   (patient_id, consultation_charge, medicine_charge, room_charge, total_amount, status, bill_date)
    VALUES(?, ?, ?, ?, ?, 'Pending', NOW())`;

  const [result]=await db.execute(query, [
    patient_id,
    consultation,
    medicine,
    room,
    total
  ]);

  return result.insertId;
};

export const updateBillStatus=async(bill_id, status)=>{
  const query=`
    UPDATE bills
    SET status=?
    WHERE bill_id=?`;

  await db.execute(query, [status, bill_id]);
};
