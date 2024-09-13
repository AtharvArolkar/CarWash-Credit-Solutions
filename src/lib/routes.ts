const BASE_URL = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

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
  getUsers: `${BASE_URL}/api/get-users`,
  getProfileDetails: `${BASE_URL}/api/get-profile-details`,
  addUser: `${BASE_URL}/api/add-user`,
  deleteUser: `${BASE_URL}/api/delete-user`,
  getClientUsers: `${BASE_URL}/api/get-client-users`,
  addTickets: `${BASE_URL}/api/add-tickets`,
  getTickets: `${BASE_URL}/api/get-tickets`,
  getTicketDetails: `${BASE_URL}/api/get-ticket-details`,
} as const;
