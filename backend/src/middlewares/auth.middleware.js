import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT=asyncHandler(async(req,res,next)=>{
  const authHeader=req.headers.authorization;

  if(!authHeader || !authHeader.startsWith("Bearer ")){
    throw new ApiError(401, "Unauthorized: Token missing");
  }

  const token=authHeader.split(" ")[1];

  try{
    const decoded=jwt.verify(token, process.env.JWT_SECRET);
    req.user=decoded;
    next();
  }catch{
    throw new ApiError(401,'Invalid Token')
  }
})