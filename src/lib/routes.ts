const BASE_URL = process.env.HOSTED_URL;

export const paths = {
  home: "/",
  login: "/login",
  changePassword: "/change-password",
};

export const apiRoutes = {
  generateAccessRefreshTokens: `${BASE_URL}/api/generate-access-refresh-tokens`,
  refreshAccessToken: `${BASE_URL}/api/refresh-access-token`,
  changePassword: `${BASE_URL}/api/change-password `,
} as const;
