import { Router } from "express";
import {
  getMeController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
} from "./auth.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { authLimiter } from "../../middlewares/ratelimiter.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authLimiter, asyncHandler(registerUserController));
router.post("/login", authLimiter, asyncHandler(loginUserController));
router.post(
  "/refresh",
  asyncHandler(refreshTokenController),
);
router.post(
  "/logout",
  verifyJWT,
  asyncHandler(logoutUserController),
);

router.get("/me", verifyJWT, asyncHandler(getMeController));

export default router;
