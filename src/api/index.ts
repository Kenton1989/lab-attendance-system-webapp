import api from "./rest";
export default api;

export * from "./rest";
export * from "./fetch";

export {
  basicAuth,
  refreshToken,
  refreshExpiringToken,
  revokeToken,
} from "./auth";

export { getCurrentUser, userHasRole } from "./user";
