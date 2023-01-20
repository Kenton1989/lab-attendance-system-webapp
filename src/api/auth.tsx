import { StatusCodes } from "http-status-codes";
import { Http4xxError, jsonFetch } from "./fetch";
import { getUrl } from "./url";

const TOKEN_URL = getUrl("/users/me/tokens/");
const CURRENT_TOKEN_URL = getUrl("/users/me/tokens/current/");
const TOKEN_KEY = "token";

/**
 * get the authentication token stored previously
 * @param storage which storage is used to get token
 * @returns the token, or an empty string if token does not exist
 */
export function getToken(storage = localStorage): string {
  let token = storage.getItem(TOKEN_KEY) ?? "";
  return token;
}

/**
 * Perform basic authentication to get and store the authentication token
 * @param username username
 * @param password plaintext password
 * @param storage which storage to store token
 * @returns if authentication is performed successfully
 */
export async function basicAuth(
  username: string,
  password: string,
  storage = localStorage
): Promise<boolean> {
  let credential = Buffer.from(`${username}:${password}`).toString("base64");
  let authHeader = `Basic ${credential}`;

  let resp: { token: string };

  try {
    resp = await jsonFetch(TOKEN_URL, undefined, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
    });
  } catch (e) {
    if (e instanceof Http4xxError) {
      if (e.status == StatusCodes.UNAUTHORIZED) {
        return false;
      }
    }
    throw e;
  }

  storage.setItem(TOKEN_KEY, resp.token);

  return true;
}

/**
 * Similar to function jsonFetch, used to send and receive data in JSON format.
 * But auth token will be included in the header.
 *
 * @param url request target URL
 * @param data body of request, will be encoded using JSON
 * @param options the same to the options of standard fetch(), but
 *                the body and some headers (Content-Type, Accept, Authorization)
 *                will be overridden if necessary.
 * @param storage where to get the token
 * @returns the body of response, decoding using JSON.
 */
export async function authJsonFetch(
  url: string,
  data?: any,
  options?: RequestInit,
  storage: Storage = localStorage
): Promise<any> {
  let requestInit = options ?? {};
  requestInit.headers = new Headers(requestInit.headers);

  let headers: Headers;
  if (requestInit.headers instanceof Headers) {
    headers = requestInit.headers;
  } else {
    headers = new Headers(requestInit.headers);
  }
  requestInit.headers = headers;

  let token = getToken(storage);
  headers.set("authorization", `Token ${token}`);

  return jsonFetch(url, data, requestInit);
}
