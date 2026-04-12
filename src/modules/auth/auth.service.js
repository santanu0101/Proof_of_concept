import redis from "../../config/redis.js";
import { User } from "../../models/User.model.js";
import ApiError from "../../utils/ApiError.js";
import { generateTokensAndSave } from "../../utils/jwt.js";
import { resUser } from "../../utils/userRes.js";

//register
export const registerUserService = async (userData) => {
  const { username, email, password } = userData;
  const existingUser = await User.findOne({
    email,
  });
  if (existingUser) {
    throw new ApiError(400, "Email already in use");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  const { accessToken, refreshToken } = await generateTokensAndSave(user);

  return {
    user: resUser(user),
    accessToken,
    refreshToken,
  };
};

//login
export const loginUserService = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid user");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateTokensAndSave(user);

  return {
    user: resUser(user),
    accessToken,
    refreshToken,
  };
};

//refresh token
export const refreshTokenService = async (userId, oldRefreshToken) => {

  const key = `refreshToken:${userId}`;
  const storedRefreshToken = await redis.get(key);

  if (!storedRefreshToken || storedRefreshToken !== oldRefreshToken) {
    const keys = await redis.keys(`refreshToken:${userId}`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
    throw new ApiError(401, "Invalid refresh token");
  }
  
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const { accessToken, refreshToken } = await generateTokensAndSave(user);

  return {
    accessToken,
    newRefreshToken: refreshToken,
  };
};
