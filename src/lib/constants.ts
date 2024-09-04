export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  LOGIN_REQUIRED: 440,
} as const;

export const LOGIN_REQUIRED_MESSAGE =
  "Please login again as your role was changed";

export const ITEMS_PER_PAGE = 10;

export const TABLE_DATE_FORMAT = "DD/MM/YYYY";

export const RECORDS_QUERY = {
  SEARCH: "search",
  PAGE: "page",
  START_DATE: "startDate",
  END_DATE: "endDate",
  HIDE_CREDITS: "credits",
} as const;
