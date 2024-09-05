const BASE_URL = process.env.HOSTED_URL;

export const paths = {
  home: "/",
  login: "/login",
  changePassword: "/change-password",
  setPassword: "/set-password",
  records: "/records",
  credits: "/credits",
  manageUsers: "/manage-users",
  editProfile: "/edit-profile",
  viewProfile: "/view-profile",
};

export const apiRoutes = {
  generateAccessRefreshTokens: `${BASE_URL}/api/generate-access-refresh-tokens`,
  refreshAccessToken: `${BASE_URL}/api/refresh-access-token`,
  changePassword: `${BASE_URL}/api/change-password `,
  checkUser: `${BASE_URL}/api/check-user`,
  getUsers: `${BASE_URL}/api/get-user`,
  addTickets: `${BASE_URL}/api/add-tickets`,
  getTickets: `${BASE_URL}/api/get-tickets`,
} as const;
