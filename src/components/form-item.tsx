import { Select, SelectProps, Spin } from "antd";
import { LabeledValue } from "antd/es/select";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RequestOptions, SimpleRestApi, UrlParamSet } from "../api";
import {
  DEFAULT_SELECT_LIST_SIZE,
  DEFAULT_SELECT_SEARCH_DELAY_MS,
} from "./const";
import debounce from "lodash/debounce";
import { useApiData } from "./backend";

function getId(val: any) {
  if (typeof val !== "object") return val;
  return val.id;
}

export type SimpleRestApiSelectProps<DataType> = {
  api: SimpleRestApi<DataType>;
  formatLabel?: (val: DataType) => LabeledValue["label"];
  formatValue?: (val: DataType) => LabeledValue["value"];
  listSize?: number;
  additionalListUrlParams?: UrlParamSet<DataType>;
  additionalListRequestParams?: RequestOptions<DataType>;
  searchDelayMs?: number;
} & SelectProps;

export function SimpleRestApiSelect<DataType>(
  props: SimpleRestApiSelectProps<DataType>
) {
  const {
    api,
    formatLabel = getId,
    formatValue = getId,
    additionalListUrlParams,
    additionalListRequestParams,
    listSize = DEFAULT_SELECT_LIST_SIZE,
    searchDelayMs = DEFAULT_SELECT_SEARCH_DELAY_MS,
    ...selectProps
  } = props;

  const [search, setSearch] = useState("");

  const [urlParams] = useState<UrlParamSet<DataType>>({
    ...additionalListUrlParams,
    limit: listSize,
    offset: 0,
  });

  const makeOptions = useCallback(
    (list?: DataType[]): LabeledValue[] => {
      if (!list) return [];

      return list.map((val) => ({
        label: formatLabel(val),
        value: formatValue(val),
      }));
    },
    [formatLabel, formatValue]
  );

  const loadData = useCallback(async () => {
    const data = await api.list({
      urlParams: {
        ...urlParams,
        search,
      },
      ...additionalListRequestParams,
    });

    if (Array.isArray(data)) {
      throw TypeError(
        `expecting paginated result from ${api.urlBase} but got an array`
      );
    }

    return { resp: data, options: makeOptions(data.results) };
  }, [api, urlParams, additionalListRequestParams, makeOptions, search]);

  const debounceUpdateSearch = useMemo(
    () =>
      debounce((val) => {
        setSearch(val);
      }, searchDelayMs),
    [searchDelayMs]
  );

  useEffect(() => {
    return debounceUpdateSearch.cancel();
  }, [debounceUpdateSearch]);

  const { data, loading } = useApiData(loadData);

  return (
    <Select
      {...selectProps}
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      options={data?.options}
      showSearch
      onSearch={debounceUpdateSearch}
    />
  );
}
