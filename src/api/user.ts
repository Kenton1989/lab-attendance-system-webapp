import { StatusCodes } from "http-status-codes";
import { getDefaultAuthStorage, getToken } from "./auth";
import { Http4xxError } from "./fetch";
import api, { User } from "./rest";

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
