import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { cookieOptions } from "../../utils/cookieOption.js";
import { decodedToken } from "../../utils/jwt.js";
import {
  loginUserService,
  refreshTokenService,
  registerUserService,
} from "./auth.service.js";
import { loginValidation, registerValidation } from "./auth.validation.js";

//register
export const registerUserController = async (req, res) => {
  const { error, value } = registerValidation.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const { user, accessToken, refreshToken } = await registerUserService(value);

  return res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", user));
};

//login
export const loginUserController = async (req, res) => {
  const { error, value } = loginValidation.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const { user, accessToken, refreshToken } = await loginUserService(value);

  return res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse(200, "Login successful", user));
};

//refresh token
export const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "No refresh token provided");
  }
  const decoded = decodedToken(refreshToken, "refresh");
  const { accessToken, newRefreshToken } = await refreshTokenService(
    decoded.id,
    refreshToken,
  );
  return res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse(200, "Token refreshed successfully"));
};

//logout
export const logoutUserController = async (_, res) => {
  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(new ApiResponse(200, "Logged out successfully"));
};

//get-me
export const getMeController = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "User info retrieved successfully", user.username),
    );
};
