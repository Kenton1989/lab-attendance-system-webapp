import { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
  response: Response;

  constructor(resp: Response, message?: string, options?: ErrorOptions) {
    super(message, options);
    this.response = resp;
  }
}

export class Http4xxError extends ApiError {
  status: number;

  constructor(resp: Response, message?: string, options?: ErrorOptions) {
    super(resp, message, options);
    if (resp.status < 400 || resp.status > 499) {
      throw new RangeError(`HTTP status code is not 4xx but ${resp.status}`);
    }
    this.status = resp.status;
  }
}

export async function loadJson(
  resp: Response,
  defaultResult: any = undefined
): Promise<any> {
  try {
    return await resp.json();
  } catch (e) {
    if (e instanceof SyntaxError) {
      return defaultResult;
    }
    throw e;
  }
}

function checkStatus(resp: Response) {
  if (resp.ok) return;

  let data = loadJson(resp, "HTTP request failed");
  console.error(data);

  if (resp.status >= 400 && resp.status < 500) {
    throw new Http4xxError(resp);
  }

  throw new ApiError(resp);
}

/**
 * Check if the body of response contain data.
 *
 * @param resp the response
 * @returns true if the body is empty
 */
export async function bodyIsEmpty(resp: Response): Promise<boolean> {
  if (resp.status == StatusCodes.NO_CONTENT) {
    return true;
  }
  if (!resp.body) {
    return true;
  }
  // read the first block and determine if it is empty
  let block1 = await resp.clone().body!.getReader().read();
  if (block1.done) {
    return true;
  }
  return false;
}

/**
 * Get requestInit.headers and ensure it is a object of type Headers.
 * If requestInit.headers is not Headers type, it will be set to a Headers object
 * with the same header definitions.
 *
 * @param requestInit
 * @returns the headers object
 */
export function getHeadersObj(requestInit: RequestInit): Headers {
  if (!(requestInit.headers instanceof Headers)) {
    requestInit.headers = new Headers(requestInit.headers);
  }
  return requestInit.headers;
}

/**
 * Send and receive data in JSON format
 *
 * @param url request target
 * @param data optional body of request, will be encoded using JSON.
 * @param options the same to the options of standard fetch(), but
 *                the body and some headers (Content-Type, Accept) will be
 *                overridden if parameter "data" is provided.
 * @returns the body of response, decoding using JSON.
 * @throws {Http4xxError} if response status is 4xx.
 * @throws {ApiError} other problems like non 2xx response, non JSON body, etc.
 */
export async function jsonFetch(
  url: string,
  data?: any,
  options: RequestInit = {}
): Promise<any> {
  let requestInit = options;

  let headers = getHeadersObj(requestInit);

  if (data) {
    requestInit.body = JSON.stringify(data);
    headers.set("content-type", "application/json");
  }

  headers.set("accept", "application/json");

  let resp = await fetch(url);

  checkStatus(resp);

  if (await bodyIsEmpty(resp)) {
    return;
  }

  try {
    return await resp.json();
  } catch (e) {
    console.error(`request to ${url} return non-json result`);
    throw new ApiError(resp);
  }
}
