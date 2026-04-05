
export const resUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  isActive: user.isActive,
});