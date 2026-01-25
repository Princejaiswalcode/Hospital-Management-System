import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {createAppointment, allAppointments, updateAppointmentStatus} from '../models/appointment.model.js';

const createappointment=asyncHandler(async(req,res)=>{
    const {patient_id,doctor_id,date,time,type}=req.body;

    if(!patient_id)throw new ApiError(400, "patient_id is required");
    if(!doctor_id)throw new ApiError(400,'doctor id is required');
    if(!date)throw new ApiError(400, "appointment_date is required");
    if(!time)throw new ApiError(400, "appointment_time is required");
    if(!type)throw new ApiError(400, "appointment_type is required");
    
    const status = "Scheduled";

    const appointmentId=await createAppointment(patient_id,doctor_id,date,time,type,status);

    return res.status(200).json(
        new ApiResponse(200,appointmentId,'appoitment created successfully')
    )
})

const getAllAppointments=asyncHandler(async(req,res)=>{
    const appointments=await allAppointments();

    return res.status(200).json(
        new ApiResponse(appointments)
    )
})

const updateStatus=asyncHandler(async(req,res)=>{
    const {appointment_id,status}=req.body

    if(!appointment_id)throw new ApiError(400, "appointment id is required");
    if(!status || !status.trim())throw new ApiError(400, "status is required");

    const updatedAppointment=await updateAppointmentStatus(appointment_id,status);

    return res.status(200).json(
        new ApiResponse(200,updatedAppointment,'appointment updated successfully')
    )
})

// const todaysAppointments=asyncHandler(async(req,res)=>{
//     const date=new Date();
//     const monthName=date.getMonth()+1;
//     const appointments=await getTodaysAppointments(date,monthName);

//     return res.status(200).json(
//         new ApiResponse(200,appointments,'Apponitments fetched successfully')
//     )
// })

export {
    createappointment,
    getAllAppointments,
    updateStatus
}