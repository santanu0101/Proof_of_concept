import { User } from "../../models/User.model.js";
import ApiError from "../../utils/ApiError.js";
import { generateTokensAndSave } from "../../utils/tokenHelper.js";


const resUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
});

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
