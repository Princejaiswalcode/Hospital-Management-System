import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTreatment=asyncHandler(async(req,res)=>{
    const treatment="await function();"
    return res(200).json(
        new ApiResponse(200,treatment,"treatment created succefully")
    )
})

const getTreatments=asyncHandler(async(req,res)=>{
    const treatments="await function()"
    return res.status(200)
    .json(
        new ApiResponse(200,treatments,"treatments fected successfully")
    )
})