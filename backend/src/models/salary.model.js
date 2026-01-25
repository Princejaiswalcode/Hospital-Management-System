import db from "../db/index.js";

export const createSalaryPayment=async(employee_id,employee_type,amount,payment_date,payment_month,payment_year,payment_method)=>{
  const query=`
    INSERT INTO salary_payments
    (employee_id, employee_type, amount, payment_date, payment_month, payment_year, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  await db.execute(query,[employee_id,employee_type,amount,payment_date,payment_month,payment_year,payment_method]);
};

export const fetchSalaryHistory=async()=>{
  const query=`SELECT 
      employee_id,
      employee_type,
      amount,
      payment_date AS date,
      'Paid' AS status
    FROM salary_payments
    ORDER BY payment_date DESC`;

  const [rows]=await db.execute(query);

  return rows;
};
