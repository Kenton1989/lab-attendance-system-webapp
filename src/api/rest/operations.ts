import { StatusCodes } from "http-status-codes";
import { authJsonFetch } from "../auth";
import { Http4xxError } from "../fetch";
import { getUrl } from "../url";
import { PreferenceSet } from "./model";

export type UrlParamSet<DataType> = {
  fields?: keyof DataType | Array<keyof DataType>;
  limit?: number;
  offset?: number;
  ordering?: string | Array<string>;
  search?: string;
  is_active?: boolean;
  [k: string]: any;
};

function formatUrlParamValue(val: any): string {
  if (Array.isArray(val)) {
    return val.join(",");
  }
  return val.toString();
}

function createUrlParamObj(params?: UrlParamSet<any>): URLSearchParams {
  let res = new URLSearchParams();
  for (const k in params) {
    const val = params[k];
    if (val === undefined) continue;
    if (val) res.set(k, formatUrlParamValue(val));
  }
  return res;
}

export type RequestOptions<DataType> = {
  urlParams?: UrlParamSet<DataType>;
} & RequestInit;

export type CanUpdateRequestOptions<DataType> = {
  emptyPatch?: any;
} & RequestOptions<DataType>;

export type PaginatedListResponse<T> = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Array<T>;
};

export type ListResponse<T> = Array<T> | PaginatedListResponse<T>;

export type SimplePatch<T> = {
  [k in keyof T]?: T[k];
};

export class SimpleRestApi<DataType, IdType = number | string> {
  urlBase: string;

  constructor(urlBase: string) {
    this.urlBase = getUrl(urlBase);
  }

  async retrieve(
    id: IdType,
    options: RequestOptions<DataType> = {}
  ): Promise<DataType> {
    let { urlParams, ...others } = options;

    let param = createUrlParamObj(urlParams);

    return await authJsonFetch(`${this.urlBase}/${id}?${param}`, undefined, {
      method: "GET",
      ...others,
    });
  }

  async list(
    options: RequestOptions<DataType> = {}
  ): Promise<ListResponse<DataType>> {
    let { urlParams, ...others } = options;

    let param = createUrlParamObj(urlParams);

    return await authJsonFetch(`${this.urlBase}?${param}`, undefined, {
      method: "GET",
      ...others,
    });
  }

  async create(
    data: DataType,
    options: RequestOptions<DataType> = {}
  ): Promise<DataType> {
    let { urlParams, ...others } = options;

    let param = createUrlParamObj(urlParams);

    return await authJsonFetch(`${this.urlBase}?${param}`, data, {
      method: "POST",
      ...others,
    });
  }

  async update(
    id: IdType,
    data: DataType,
    options: RequestOptions<DataType> = {}
  ): Promise<DataType> {
    let { urlParams, ...others } = options;

    let param = createUrlParamObj(urlParams);

    return await authJsonFetch(`${this.urlBase}/${id}?${param}`, data, {
      method: "PATCH",
      ...others,
    });
  }

  // test if user has update permission by sending an empty patch
  async canUpdate(
    id: IdType,
    options: CanUpdateRequestOptions<DataType> = {}
  ): Promise<boolean> {
    let { urlParams, emptyPatch = {}, ...others } = options;

    let param = createUrlParamObj({
      ...urlParams,
    });

    try {
      await authJsonFetch(`${this.urlBase}/${id}?${param}`, emptyPatch, {
        method: "PATCH",
        ...others,
      });
    } catch (e) {
      if (e instanceof Http4xxError && e.status === StatusCodes.FORBIDDEN) {
        return false;
      }
      throw e;
    }
    return true;
  }

  async destroy(
    id: IdType,
    options: RequestOptions<DataType> = {}
  ): Promise<DataType> {
    let { urlParams, ...others } = options;

    let param = createUrlParamObj(urlParams);

    return await authJsonFetch(`${this.urlBase}/${id}?${param}`, undefined, {
      method: "DELETE",
      ...others,
    });
  }
}

export class PreferenceApi {
  urlBase = getUrl("/preferences");

  async list(options: RequestOptions<any> = {}): Promise<PreferenceSet> {
    let { urlParams, ...others } = options;

    let param = createUrlParamObj(urlParams);

    return await authJsonFetch(`${this.urlBase}?${param}`, undefined, {
      method: "GET",
      ...others,
    });
  }

  async retrieve(
    id: keyof PreferenceSet,
    options: RequestOptions<any> = {}
  ): Promise<any> {
    let { urlParams, ...others } = options;

    let param = createUrlParamObj(urlParams);

    return await authJsonFetch(`${this.urlBase}/${id}?${param}`, undefined, {
      method: "GET",
      ...others,
    });
  }

  async update(
    id: keyof PreferenceSet,
    value: any,
    options: RequestOptions<any> = {}
  ): Promise<any> {
    let { urlParams, ...others } = options;

    let param = createUrlParamObj(urlParams);

    return await authJsonFetch(`${this.urlBase}/${id}?${param}`, value, {
      method: "PUT",
      ...others,
    });
  }
}
