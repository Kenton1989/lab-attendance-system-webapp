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
    return api.user.retrieve("me");
  } catch (e) {
    if (e instanceof Http4xxError && e.status === StatusCodes.UNAUTHORIZED) {
      return undefined;
    }
    throw e;
  }
}
