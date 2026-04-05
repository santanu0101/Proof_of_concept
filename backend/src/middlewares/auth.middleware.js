import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const verifyJWT = (req, _, next) => {
  const token = req.cookies.accessToken;
  // console.log("Access token", token);

  if (!token) throw new ApiError(401, "Access token missing");

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // console.log("Decoded JWT", decoded);
    req.userId = decoded.id;
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
};
