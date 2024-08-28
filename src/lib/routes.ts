const BASE_URL = process.env.HOSTED_URL;

export const paths = {
  home: "/",
  login: "/login",
  changePassword: "/change-password",
};

export const apiRoutes = {
  generateAccessRefreshTokens: `${BASE_URL}/api/generateAccessRefreshTokens`,
  refreshAccessToken: `${BASE_URL}/api/refreshAccessToken`,
} as const;
