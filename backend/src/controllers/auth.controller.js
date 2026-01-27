import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const loginUser=asyncHandler(async(req,res)=>{
  const {username,password,role}=req.body;

  if(!username || !password || !role){
    throw new ApiError(400,"All fields are required");
  }

  const normalizedRole=role.toLowerCase();

  const query = `SELECT user_id, username, password, role, full_name
    FROM users
    WHERE username=?`;

  db.query(query,[username],async(err, results)=>{
    if(err){
      throw new ApiError(500,"Database error");
    }

    if(results.length===0){
      throw new ApiError(401,"Invalid credentials");
    }

    const user=results[0];

    if(user.role!==normalizedRole){
      throw new ApiError(403,"Role mismatch");
    }

    const isMatch=await bcrypt.compare(password, user.password);
    if(!isMatch){
      throw new ApiError(401, "Invalid credentials");
    }

    const token=jwt.sign(
      {
        id: user.user_id,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );

    return res.status(200).json(
      new ApiResponse(200, {
        token,
        name: user.full_name,
        role: user.role
      }, "Login successful")
    );
  });
});

export const logoutUser=asyncHandler(async(req,res)=>{
  return res.status(200).json({
    message:"Logout successful"
  });
});