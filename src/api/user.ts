import { StatusCodes } from "http-status-codes";
import { getDefaultAuthStorage, getToken } from "./auth";
import { Http4xxError } from "./fetch";
import api, { Role, User } from "./rest";

export async function getCurrentUser(
  storage = getDefaultAuthStorage()
): Promise<User | undefined> {
  let token = getToken(storage);
  if (!token) return undefined;

  try {
    return await api.user.retrieve("me", {
      urlParams: {
        fields: ["id", "username", "display_name", "email", "roles"],
      },
    });
  } catch (e) {
    if (e instanceof Http4xxError && e.status === StatusCodes.UNAUTHORIZED) {
      console.warn("accessing page without login");
      return undefined;
    }
    throw e;
  }
}

export function userHasRole(
  user: User,
  roles: Role | string | Array<Role | string>
): boolean {
  if (!user.roles) return false;

  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  const strRoles = roles.map((r) => (typeof r === "string" ? r : r.name));

  return user.roles.some(({ name }) => strRoles.includes(name));
}
