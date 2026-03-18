export const ROUTE_BASE = {
  AUTH: "/api/auth",
  USER:"/api/user"
};

export interface ApiEndpoint {
  method: string;
  url: string;
  path: string;
}

const endpoint = (method: string, base: string, path: string): ApiEndpoint => ({
  method,
  url: `${base}${path}`,
  path,
});

export const AUTH_ENDPOINTS = {
  REGISTER: endpoint("POST", ROUTE_BASE.AUTH, "/register"),
  LOGIN: endpoint("POST", ROUTE_BASE.AUTH, "/login"),
  LOGOUT: endpoint("POST", ROUTE_BASE.AUTH, "/logout"),
};

export const API_ENDPOINTS: Record<string, Record<string, ApiEndpoint>> = {
    AUTH: AUTH_ENDPOINTS,
}
