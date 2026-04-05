import jwt from "jsonwebtoken";
import ApiError from "./ApiError.js";

//token generation
export const generateTokensAndSave = async (user) => {
  if(!user){
    throw new ApiError(400, "User data is required for token generation");
  }
  const accessToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate tokens");
  }

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};


//token decode
export const decodedToken = (token, type) => {
  try {
    const decoded = jwt.verify(token, type === "access" ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET);
    return decoded;
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
};
