import { db } from "../db/index.js";

/* =========================
   SALARY QUERIES
========================= */

// Get all salary payments with employee names
export const getAllSalaryPayments = async () => {
  const [rows] = await db.execute(`
    SELECT 
      sp.payment_id,
      sp.employee_id,
      sp.employee_type,
      sp.amount,
      sp.payment_date,
      sp.payment_month,
      sp.payment_year,
      sp.payment_method,

      CASE 
        WHEN sp.employee_type = 'doctor' THEN 
          (SELECT CONCAT(d.first_name, ' ', d.last_name) 
           FROM doctors d 
           WHERE d.doctor_id = sp.employee_id)

        WHEN sp.employee_type = 'nurse' THEN 
          (SELECT CONCAT(n.first_name, ' ', n.last_name) 
           FROM nurses n 
           WHERE n.nurse_id = sp.employee_id)

        WHEN sp.employee_type = 'receptionist' THEN 
          (SELECT CONCAT(r.first_name, ' ', r.last_name) 
           FROM receptionists r 
           WHERE r.receptionist_id = sp.employee_id)

        ELSE CONCAT(sp.employee_type, ' #', sp.employee_id)
      END AS employee_name

    FROM salary_payments sp
    ORDER BY sp.payment_date DESC
  `);

  return rows;
};


// Get salary by employee (with name)
export const getSalaryByEmployee = async (employee_id) => {
  const [rows] = await db.execute(
    `
    SELECT 
      sp.*,

      CASE 
        WHEN sp.employee_type = 'doctor' THEN 
          (SELECT CONCAT(d.first_name, ' ', d.last_name) 
           FROM doctors d 
           WHERE d.doctor_id = sp.employee_id)

        WHEN sp.employee_type = 'nurse' THEN 
          (SELECT CONCAT(n.first_name, ' ', n.last_name) 
           FROM nurses n 
           WHERE n.nurse_id = sp.employee_id)

        WHEN sp.employee_type = 'receptionist' THEN 
          (SELECT CONCAT(r.first_name, ' ', r.last_name) 
           FROM receptionists r 
           WHERE r.receptionist_id = sp.employee_id)

        ELSE CONCAT(sp.employee_type, ' #', sp.employee_id)
      END AS employee_name

    FROM salary_payments sp
    WHERE sp.employee_id = ?
    ORDER BY sp.payment_date DESC
    `,
    [employee_id]
  );

  return rows;
};


// Create salary payment (with validation)
export const createSalaryPayment = async (data) => {
  const {
    employee_id,
    employee_type,
    amount,
    payment_date,
    payment_month,
    payment_year,
    payment_method
  } = data;

  // Basic validation (backend safety)
  if (!employee_id || !employee_type || !payment_date) {
    throw new Error("Missing required fields");
  }

  if (amount <= 0) {
    throw new Error("Invalid amount");
  }

  const [result] = await db.execute(
    `
    INSERT INTO salary_payments
    (employee_id, employee_type, amount, payment_date, payment_month, payment_year, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      employee_id,
      employee_type,
      amount,
      payment_date,
      payment_month,
      payment_year,
      payment_method || "cash"
    ]
  );

  return result.insertId;
};