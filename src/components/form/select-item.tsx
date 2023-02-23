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
} from "../../api";
import {
  DEFAULT_SELECT_LIST_SIZE,
  DEFAULT_SELECT_SEARCH_DELAY_MS,
} from "../const";
import debounce from "lodash/debounce";
import { useApiData } from "../backend";

function getId(val: any) {
  if (typeof val !== "object")
    throw new TypeError("expecting an object but got a " + typeof val);
  return val.id;
}

const EMPTY: any[] = [];

export type SimpleRestApiSelectProps<DataType> = {
  api: SimpleRestApi<DataType>;
  formatLabel?: (val: DataType) => LabeledValue["label"];
  formatValue?: (val: DataType) => LabeledValue["value"];
  listSize?: number;
  additionalListUrlParams?: UrlParamSet<DataType>;
  additionalListRequestParams?: RequestOptions<DataType>;
  searchDelayMs?: number;
  persistDataOptions?: DataType[];
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
    persistDataOptions = EMPTY,
    ...selectProps
  } = props;

  const [search, setSearch] = useState("");

  const [urlParams] = useState<UrlParamSet<DataType>>({
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
        ...additionalListUrlParams,
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

    const persistOptions = makeOptions(persistDataOptions);
    const persistValues = persistOptions.map(({ value }) => value);
    const queriedOptions = makeOptions(data.results).filter(
      ({ value }) => !persistValues.includes(value)
    );
    const options = [...persistOptions, ...queriedOptions];

    return { options };
  }, [
    api,
    urlParams,
    additionalListUrlParams,
    additionalListRequestParams,
    persistDataOptions,
    makeOptions,
    search,
  ]);

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
    // reset the delayLoading to false when loading finally happens or search is cleared
    if (!search || loading) {
      setDelayLoading(false);
    }

    // clean the pending call
    return debounceUpdateSearch.cancel();
  }, [search, loading, debounceUpdateSearch]);

  const loadingOptions = loading || delayLoading;

  return (
    <Select
      {...selectProps}
      filterOption={false}
      notFoundContent={
        loadingOptions ? (
          <Spin size="small" />
        ) : (
          <Empty style={{ maxWidth: "100%" }} />
        )
      }
      options={loadingOptions ? [] : data?.options}
      loading={loadingOptions}
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

export function UserSelect(
  props: Partial<SimpleRestApiSelectProps<User>> & { role?: string }
) {
  const { role, ...otherProps } = props;

  const finalProps: SimpleRestApiSelectProps<User> = {
    api: api.user,
    formatLabel: formatUserLabel,
    ...otherProps,
    additionalListUrlParams: {
      role_names_contain: role,
      ...props.additionalListUrlParams,
    },
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
  return `${val.username} (${val.room_count} rooms)`;
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
