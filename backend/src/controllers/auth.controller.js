import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../db/index.js";
import{ApiError} from "../utils/ApiError.js";
import{ApiResponse} from "../utils/ApiResponse.js";
import{asyncHandler} from "../utils/asyncHandler.js";

const roleTableMap={
  Admin:"admins",
  Doctor:"doctors",
  Nurse:"nurses",
  Patient:"patients",
  Accounts:"accounts",
  Reception:"receptionists"
};

export const loginUser=asyncHandler(async(req,res)=>{
  const{username,password,role}=req.body;

  const table=roleTableMap[role];
  if(!table){
    throw new ApiError(400,"Invalid role");
 }

  const query=`SELECT * FROM ${table} WHERE username=?`;

  db.query(query,[username],async(err,results)=>{
    if(err){
      throw new ApiError(500,"Database error");
   }

    if(results.length === 0){
      throw new ApiError(401,"User not found");
   }

    const user=results[0];

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      throw new ApiError(401,"Invalid password");
   }

    const token=jwt.sign(
     {
        id:user.id,
        role,
        username:user.username
     },
      process.env.JWT_SECRET,
    {expiresIn:"1h"}
    );

    return res.status(200).json({
      token,
      name:user.username,
      role
    });
 });
});


export const logoutUser=asyncHandler(async(req,res)=>{
  return res.status(200).json({
    message:"Logout successful"
  });
});