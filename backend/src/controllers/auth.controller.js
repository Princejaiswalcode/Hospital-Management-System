import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const loginUser = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json(
      new ApiResponse(400, null, "All fields are required")
    );
  }

  const normalizedRole = role.toLowerCase();

  try {
    const query = `SELECT user_id, username, password, role, full_name
      FROM users
      WHERE username=?`;

    const [results] = await db.query(query, [username]);

    if (results.length === 0) {
      return res.status(401).json(
        new ApiResponse(401, null, "Invalid credentials")
      );
    }

    const user = results[0];

    if (user.role !== normalizedRole) {
      return res.status(403).json(
        new ApiResponse(403, null, "Role mismatch")
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(
        new ApiResponse(401, null, "Invalid credentials")
      );
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          token,
          name: user.full_name,
          role: user.role,
        },
        "Login successful"
      )
    );
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json(
      new ApiResponse(500, err.message, "Internal error")
    );
  }
};


export const logoutUser=asyncHandler(async(req,res)=>{
  return res.status(200).json({
    message:"Logout successful"
  });
});