import { Empty, Select, SelectProps, Spin } from "antd";
import { LabeledValue } from "antd/es/select";
import { useCallback, useEffect, useMemo, useState } from "react";
import api, {
  Course,
  Group,
  Lab,
  RequestOptions,
  Role,
  SimpleRestApi,
  UrlParamSet,
  User,
  Week,
} from "../api";
import {
  DEFAULT_SELECT_LIST_SIZE,
  DEFAULT_SELECT_SEARCH_DELAY_MS,
} from "./const";
import debounce from "lodash/debounce";
import { useApiData } from "./backend";

function getId(val: any) {
  if (typeof val !== "object")
    throw new TypeError("expecting an object but got a " + typeof val);
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

  const { data, loading } = useApiData(loadData);

  const [delayLoading, setDelayLoading] = useState(false);

  const debounceUpdateSearch = useMemo(
    () =>
      debounce((val) => {
        setSearch(val);
      }, searchDelayMs),
    [searchDelayMs]
  );

  const onSearch = useCallback(
    (val: string) => {
      setDelayLoading(true);
      debounceUpdateSearch(val);
    },
    [debounceUpdateSearch]
  );

  useEffect(() => {
    // when loading finally happens, reset the delayLoading to false
    if (loading) {
      setDelayLoading(false);
    }

    // clean the pending call
    return debounceUpdateSearch.cancel();
  }, [loading, debounceUpdateSearch]);

  const hideOptions = loading || delayLoading;

  return (
    <Select
      {...selectProps}
      filterOption={false}
      notFoundContent={hideOptions ? <Spin size="small" /> : <Empty />}
      options={hideOptions ? [] : data?.options}
      loading={hideOptions}
      showSearch
      allowClear
      onSearch={onSearch}
    />
  );
}

type Partial<T> = {
  [k in keyof T]?: T[k];
};

function formatUserLabel(val: User) {
  return `${val.display_name || val.username} (${val.username})`;
}

export function UserSelect(props: Partial<SimpleRestApiSelectProps<User>>) {
  const finalProps: SimpleRestApiSelectProps<User> = {
    api: api.user,
    formatLabel: formatUserLabel,
    ...props,
    style: { minWidth: "16em", ...props.style },
  };
  return <SimpleRestApiSelect {...finalProps} />;
}

function formatRoleLabel(val: Role) {
  return val.name;
}

export function RoleSelect(props: Partial<SimpleRestApiSelectProps<Role>>) {
  const finalProps: SimpleRestApiSelectProps<Role> = {
    api: api.role,
    formatLabel: formatRoleLabel,
    ...props,
    style: { minWidth: "8em", ...props.style },
  };
  return <SimpleRestApiSelect {...finalProps} />;
}

function formatCourseLabel(val: Course) {
  return val.code;
}

export function CourseSelect(props: Partial<SimpleRestApiSelectProps<Course>>) {
  const finalProps: SimpleRestApiSelectProps<Course> = {
    api: api.course,
    formatLabel: formatCourseLabel,
    ...props,
    style: { minWidth: "8em", ...props.style },
  };
  return <SimpleRestApiSelect {...finalProps} />;
}
function formatLabLabel(val: Lab) {
  return val.username;
}

export function LabSelect(props: Partial<SimpleRestApiSelectProps<Lab>>) {
  const finalProps: SimpleRestApiSelectProps<Lab> = {
    api: api.lab,
    formatLabel: formatLabLabel,
    ...props,
    style: { minWidth: "8em", ...props.style },
  };
  return <SimpleRestApiSelect {...finalProps} />;
}

function formatGroupLabel(val: Group) {
  return `${val.course?.code} ${val.name}`;
}

export function GroupSelect(props: Partial<SimpleRestApiSelectProps<Group>>) {
  const finalProps: SimpleRestApiSelectProps<Group> = {
    api: api.group,
    formatLabel: formatGroupLabel,
    ...props,
    style: { minWidth: "16em", ...props.style },
  };
  return <SimpleRestApiSelect {...finalProps} />;
}

function formatWeekLabel(val: Week) {
  return val.name;
}

export function WeekSelect(props: Partial<SimpleRestApiSelectProps<Week>>) {
  const finalProps: SimpleRestApiSelectProps<Week> = {
    api: api.week,
    formatLabel: formatWeekLabel,
    ...props,
    style: { minWidth: "8em", ...props.style },
  };
  return <SimpleRestApiSelect {...finalProps} />;
}
