import {createSalaryPayment,fetchSalaryHistory} from "../models/salary.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const processSalary=asyncHandler(async(req,res)=>{
  const {employee_id,employee_type,amount,payment_date,payment_method}=req.body;

  if(!employee_id)throw new ApiError(400,"Employee ID required");
  if(!employee_type)throw new ApiError(400,"Employee type required");
  if(!amount || amount<=0)throw new ApiError(400,"Invalid amount");
  if(!payment_date)throw new ApiError(400,"Payment date required");
  if(!payment_method)throw new ApiError(400,"Payment method required");

  const date=new Date(payment_date);
  const month=date.toLocaleString("default",{month:"long"});
  const year=date.getFullYear();

  await createSalaryPayment(employee_id,employee_type,amount,payment_date,month,year,payment_method);

  return res.status(201).json({
    message: "Salary payment processed successfully"
  });
});

const getSalaryHistory=asyncHandler(async(_,res)=>{
  const history=await fetchSalaryHistory();

  return res.status(200).json(history);
});

export {processSalary,getSalaryHistory};