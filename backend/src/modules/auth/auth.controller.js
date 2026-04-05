import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { loginUserService, registerUserService } from "./auth.service.js";
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
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
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
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    })
    .status(200)
    .json(new ApiResponse(200, "Login successful", user));
};

//refresh token
export const refreshTokenController = async (req, res) => {};

//logout
export const logoutUserController = async (_, res) => {
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(new ApiResponse(200, "Logged out successfully"));
};
