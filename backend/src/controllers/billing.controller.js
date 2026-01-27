import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  fetchAllBills,
  insertBill,
  updateBillStatus
} from "../models/billind.model.js"

export const getBills=asyncHandler(async(req,res)=>{
  const bills=await fetchAllBills();
  return res.status(200).json(bills);
});


export const createBill=asyncHandler(async(req,res)=>{
  const { patient_id,consultation,medicine,room }=req.body;

  if(!patient_id) throw new ApiError(400,"patient_id is required");

  const c=Number(consultation) || 0;
  const m=Number(medicine) || 0;
  const r=Number(room) || 0;

  const total=c+m+r;

  const billId=await insertBill(
    patient_id,
    c,
    m,
    r,
    total
  );

  return res.status(201).json({
    message:"Bill generated",
    bill_id:billId
  });
});

export const markBillPaid=asyncHandler(async(req,res)=>{
  const { id }=req.params;

  if(!id) throw new ApiError(400,"Bill ID required");

  await updateBillStatus(id,"Paid");

  return res.status(200).json({
    message:"Payment updated"
  });
});
