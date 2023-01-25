import { StatusCodes } from "http-status-codes";
import { getHeadersObj, Http4xxError, jsonFetch } from "./fetch";
import { getUrl } from "./url";

const TOKEN_URL = getUrl("/users/me/tokens/");
const CURRENT_TOKEN_URL = getUrl("/users/me/tokens/current/");
const TOKEN_KEY = "token";
const TOKEN_EXPIRY_KEY = "expiry";
let defaultAuthStorage = localStorage;

export function getDefaultAuthStorage() {
  return defaultAuthStorage;
}

export function setDefaultAuthStorage(s: Storage) {
  defaultAuthStorage = s;
}

/**
 * get the authentication token stored previously
 * @param storage which storage is used to get token
 * @returns the token, or null if token does not exist
 */
export function getToken(storage = getDefaultAuthStorage()): string | null {
  return storage.getItem(TOKEN_KEY);
}

/**
 * get the expiration time authentication token stored previously
 * @param storage which storage is used to get token
 * @returns the expiry time, or null if token does not exist
 */
export function getTokenExpiry(storage = getDefaultAuthStorage()): Date | null {
  let expiry = storage.getItem(TOKEN_EXPIRY_KEY);
  if (expiry === null) {
    return null;
  }
  return new Date(expiry);
}

/**
 * Create token by sending a POST request with the given authentication header to the backend.
 * The resulting token and expiry will be stored in the given storage.
 *
 * @param authHeader the authentication header
 * @param storage the storage to store the token and expiry.
 * @returns if the authentication succeeded
 */
async function performCreateToken(
  authHeader: string,
  storage: Storage
): Promise<boolean> {
  let resp: { token: string; expiry: string };

  try {
    resp = await jsonFetch(TOKEN_URL, undefined, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      credentials: "include",
    });
  } catch (e) {
    if (e instanceof Http4xxError && e.status == StatusCodes.UNAUTHORIZED) {
      return false;
    }
    throw e;
  }

  storage.setItem(TOKEN_KEY, resp.token);
  storage.setItem(TOKEN_EXPIRY_KEY, resp.expiry);

  return true;
}

/**
 * Revoke token by sending a request with the given auth token to the backend.
 *
 * @param token the authentication token to revoke
 * @param storage the storage to clean after token is revoked. If it is undefined, cleaning will not be performed.
 * @returns if the revoking succeeded
 */
async function performRevokeToken(
  token: string,
  storage?: Storage
): Promise<boolean> {
  try {
    await jsonFetch(CURRENT_TOKEN_URL, undefined, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
      credentials: "include",
    });
  } catch (e) {
    if (e instanceof Http4xxError && e.status == StatusCodes.UNAUTHORIZED) {
      return false;
    }
    throw e;
  }

  storage?.removeItem(TOKEN_KEY);
  storage?.removeItem(TOKEN_EXPIRY_KEY);

  return true;
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
  storage = getDefaultAuthStorage()
): Promise<boolean> {
  let credential = btoa(`${username}:${password}`);
  let authHeader = `Basic ${credential}`;

  return performCreateToken(authHeader, storage);
}

/**
 * Refresh the token in the given storage.
 *
 * @param storage
 * @returns if the refreshment succeeded.
 */
export async function refreshToken(
  storage = getDefaultAuthStorage()
): Promise<boolean> {
  let token = getToken(storage);
  if (token === null) {
    return false;
  }

  let authHeader = `Token ${token}`;

  let res = await performCreateToken(authHeader, storage);
  if (!res) return false;

  performRevokeToken(token);
  return true;
}

/**
 * Refresh the existing token and if it will expire within the specified duration.
 * @param minAliveSeconds the threshold that the token will be alive (not expire).
 */
export async function refreshExpiringToken(
  minAliveMs = 7200000 /* 2 hours */,
  storage = getDefaultAuthStorage()
) {
  let expiry = getTokenExpiry();
  if (expiry == null) {
    return;
  }

  let minExpireTime = new Date(Date.now() + minAliveMs);
  if (minExpireTime < expiry) {
    return;
  }

  refreshToken(storage);
}

/**
 * Revoke existing token (logout).
 *
 * @param storage the storage to get the token to revoke.
 * @returns if the revoking succeeded
 */
export async function revokeToken(
  storage = getDefaultAuthStorage()
): Promise<boolean> {
  let token = getToken();

  if (!token) return false;

  return performRevokeToken(token, storage);
}

/**
 * Similar to function jsonFetch, used to send and receive data in JSON format.
 * But auth token will be included in the header.
 *
 * @param url request target URL
 * @param data body of request, will be encoded using JSON and put inside body
 * @param options the same to the options of standard fetch(), but
 *                the body and some headers (Content-Type, Accept, Authorization)
 *                will be overridden if necessary.
 * @param storage where to get the token
 * @returns the body of response, decoding using JSON.
 */
export async function authJsonFetch(
  url: string,
  data?: any,
  options: RequestInit = {},
  storage: Storage = getDefaultAuthStorage()
): Promise<any> {
  let requestInit = options;

  let headers = getHeadersObj(requestInit);

  let token = getToken(storage);

  headers.set("authorization", `Token ${token}`);
  requestInit.credentials = "include";

  return jsonFetch(url, data, requestInit);
}
