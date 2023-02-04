import { useCallback, useEffect, useMemo, useState } from "react";
import { Http4xxError } from "../api/fetch";
import { useAuth } from "./auth-context";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";
import { DEFAULT_404_PATH } from "./const";

type UseApiLoaderOptions = {
  redirectOn4xx?: { [k: number]: string | undefined };
  onError?: (error: any) => unknown;
};

type UseApiLoaderResult<T> = {
  loading: boolean;
  reload: () => Promise<void>;
  data?: T;
  error?: any;
};

function throwError(e: any) {
  throw e;
}

export function useApiData<T>(
  dataLoader: () => T | Promise<T>,
  options: UseApiLoaderOptions = {}
): UseApiLoaderResult<T> {
  const { auth } = useAuth();
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();
  const navigate = useNavigate();

  const DEFAULT_REDIRECT_ON_4XX = useMemo(
    () => ({
      [StatusCodes.UNAUTHORIZED]: auth.loginPagePath,
      [StatusCodes.FORBIDDEN]: DEFAULT_404_PATH,
      [StatusCodes.NOT_FOUND]: DEFAULT_404_PATH,
    }),
    [auth.loginPagePath]
  );

  const {
    redirectOn4xx = DEFAULT_REDIRECT_ON_4XX,
    onError: onOtherError = throwError,
  } = options;

  const performLoadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dataLoader();
      setData(data);
    } catch (e) {
      console.error(e);
      setError(e);

      if (!(e instanceof Http4xxError)) {
        onOtherError(e);
        throw e;
      }

      const path = redirectOn4xx[e.status];
      if (path) navigate(path);
      else onOtherError(e);
    } finally {
      setLoading(false);
    }
  }, [dataLoader, navigate, redirectOn4xx, onOtherError]);

  useEffect(() => {
    performLoadData();
  }, [performLoadData]);

  return useMemo(
    () => ({ data, loading, error, reload: performLoadData }),
    [data, loading, error, performLoadData]
  );
}
