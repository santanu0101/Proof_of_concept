import { generateAccessToken, generateRefreshToken } from "./jwt.js";

export const generateTokensAndSave = async (user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate tokens");
  }

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};