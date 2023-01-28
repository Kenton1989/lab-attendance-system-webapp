import {
  DownloadOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  FormProps,
  Input,
  Space,
  Table,
  TableProps,
} from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SimpleRestApi, UrlParamSet, RequestOptions } from "../api";
import { useApiData } from "./backend";
import { DEFAULT_PAGE_SIZE } from "./const";

function doNothing() {}

export type SimpleRestApiTableProps<DataType, FiltersType = any> = {
  api: SimpleRestApi<DataType>;
  columns: ColumnsType<DataType>;
  formatItemPath: (item: DataType) => string;
  allowFilterByIsActive?: boolean;
  allowSearch?: boolean;
  allowCreate?: boolean;
  allowUploadCsv?: boolean;
  allowDownloadCsv?: boolean;
  defaultPageSize?: number;
  additionalListUrlParams?: UrlParamSet<DataType>;
  additionalListRequestParams?: RequestOptions<DataType>;
  additionalCreateBodyParams?: DataType;
  additionalCreateRequestParams?: RequestOptions<DataType>;
  tableProps?: TableProps<DataType>;
  formProps?: FormProps<FiltersType>;
  filterFormItems?: React.ReactNode;
};

function calLimitOffset(page: number, pageSize: number) {
  return {
    limit: pageSize,
    offset: Math.max(pageSize * (page - 1), 0),
  };
}

function formatOrderingQuery<DataType>(
  sorter: SorterResult<DataType> | SorterResult<DataType>[]
): string[] {
  if (!Array.isArray(sorter)) {
    sorter = [sorter];
  }

  return sorter.reduce((pre, s) => {
    if (!s.order) {
      return pre;
    }

    let prefix = "";
    if (s.order === "descend") {
      prefix = "-";
    }
    return [...pre, `${prefix}${s.field}`];
  }, new Array<string>());
}

export function SimpleRestApiTable<DataType extends object, FiltersType = any>(
  props: SimpleRestApiTableProps<DataType, FiltersType>
) {
  const {
    api,
    columns,
    formatItemPath,
    defaultPageSize = DEFAULT_PAGE_SIZE,
    additionalListUrlParams,
    additionalListRequestParams,
    allowFilterByIsActive = true,
    allowSearch = false,
    allowCreate = false,
    allowUploadCsv = false,
    allowDownloadCsv = false,
    tableProps,
    formProps,
    filterFormItems,
  } = props;

  const [urlParams, setUrlParams] = useState<UrlParamSet<DataType>>({
    ...additionalListUrlParams,
    limit: defaultPageSize,
    offset: 0,
    is_active: true,
  });

  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    const data = await api.list({
      urlParams: {
        ...urlParams,
        ...calLimitOffset(currentPage, pageSize),
      },
      ...additionalListRequestParams,
    });

    if (Array.isArray(data)) {
      throw TypeError(
        `expecting paginated result from ${api.urlBase} but got an array`
      );
    }

    return data;
  }, [api, urlParams, additionalListRequestParams, currentPage, pageSize]);

  const getRowProps = useCallback(
    (record: DataType) => ({
      onClick: () => {
        navigate(formatItemPath(record));
      },
    }),
    [navigate, formatItemPath]
  );

  const { data, loading } = useApiData(loadData);

  const onTableChanged = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<DataType> | SorterResult<DataType>[]
    ) => {
      if (pageSize !== pagination.pageSize) {
        setCurrentPage(1);
      } else {
        setCurrentPage(pagination.current!);
      }

      setPageSize(pagination.pageSize!);

      setUrlParams({
        ...urlParams,
        ...filters,
        ordering: formatOrderingQuery(sorter),
      });
    },
    [urlParams, pageSize]
  );

  const onFormSubmitted = useCallback(
    (val: FiltersType) => {
      setUrlParams({
        ...urlParams,
        ...val,
      });
    },
    [urlParams]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [data?.count]);

  const dataLength = data?.results?.length ?? 0;
  const dataSource =
    dataLength > pageSize ? data?.results?.slice(0, pageSize) : data?.results;

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {
        <FiltersForm
          {...formProps}
          filterFormItems={filterFormItems}
          onSubmit={onFormSubmitted}
          disabled={loading}
        />
      }
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        size="small"
        pagination={{
          total: data?.count,
          current: currentPage,
          pageSize: pageSize,
          hideOnSinglePage: true,
        }}
        title={() => (
          <Space>
            {allowSearch && (
              <Input.Search
                size="small"
                placeholder="search..."
                onSearch={(val) => {
                  setUrlParams({ ...urlParams, search: val });
                }}
                allowClear
              />
            )}
            {allowFilterByIsActive && (
              <Checkbox
                onChange={(e) => {
                  setUrlParams({
                    ...urlParams,
                    is_active: e.target.checked ? undefined : true,
                  });
                }}
                defaultChecked={false}
              >
                Show Inactive
              </Checkbox>
            )}
            {allowCreate && <Button icon={<PlusOutlined />}>Add</Button>}
            {allowUploadCsv && (
              <Button icon={<UploadOutlined />}>Upload CSV</Button>
            )}
            {allowDownloadCsv && (
              <Button icon={<DownloadOutlined />}>Download CSV</Button>
            )}
          </Space>
        )}
        onRow={getRowProps}
        onChange={onTableChanged}
        {...tableProps}
      />
    </Space>
  );
}

function FiltersForm<FiltersType>(
  props: {
    filterFormItems?: React.ReactNode;
    onSubmit?: FormProps<FiltersType>["onFinish"];
  } & FormProps<FiltersType>
) {
  const { filterFormItems, onSubmit = doNothing, ...formProps } = props;

  return (
    <>
      {filterFormItems && (
        <Form size="small" layout="inline" {...formProps} onFinish={onSubmit}>
          {filterFormItems}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Apply Filters
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
}