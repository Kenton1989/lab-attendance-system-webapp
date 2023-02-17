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
  Typography,
} from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SimpleRestApi,
  UrlParamSet,
  RequestOptions,
  PaginatedListResponse,
} from "../api";
import { useApiData } from "./backend";
import { DEFAULT_PAGE_SIZE } from "./const";

function doNothing() {}

function identity(val: any) {
  return val;
}

export type SimpleRestApiTableProps<DataType, FiltersType = any> = {
  api: SimpleRestApi<DataType>;
  columns?: ColumnsType<DataType>;
  formatItemPath: (item: DataType) => string;
  onDataLoaded?: (data: PaginatedListResponse<DataType>) => unknown;
  title?: string;
  hideTableHeader?: boolean;
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
  filterFormItems?: React.ReactNode;
  filterFormProps?: FormProps<FiltersType>;
  filterFormToParams?: (val: FiltersType) => UrlParamSet<DataType>;
  hideIfEmpty?: boolean;
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
    title,
    onDataLoaded = doNothing,
    defaultPageSize = DEFAULT_PAGE_SIZE,
    additionalListUrlParams,
    additionalListRequestParams,
    hideTableHeader = false,
    allowFilterByIsActive = true,
    allowSearch = false,
    allowCreate = false,
    allowUploadCsv = false,
    allowDownloadCsv = false,
    tableProps,
    filterFormProps,
    filterFormItems,
    filterFormToParams = identity,
    hideIfEmpty = false,
  } = props;

  // pagination states
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);

  // used when sending GET request to backend
  const [urlParams, setUrlParams] = useState<UrlParamSet<DataType>>({
    ...additionalListUrlParams,
    limit: defaultPageSize,
    offset: 0,
    is_active: true,
  });

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

    onDataLoaded(data);

    return data;
  }, [
    api,
    urlParams,
    additionalListRequestParams,
    currentPage,
    pageSize,
    onDataLoaded,
  ]);

  // useApiData will call loadData when it changed.
  // loadData is defined using useCallback, which means the change of
  // dependencies will incur the change of loadData. Therefore,
  // the updating of data is done by updating the dependencies.
  const { data, loading } = useApiData(loadData);

  // used to add listeners to table row
  const getRowProps = useCallback(
    (record: DataType) => ({
      onClick: () => {
        // navigate to the path representing the corresponding item
        navigate(formatItemPath(record));
      },
    }),
    [navigate, formatItemPath]
  );

  // maintain the urlParams and pagination data when the table changed.
  const onTableChanged = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<DataType> | SorterResult<DataType>[]
    ) => {
      if (pageSize !== pagination.pageSize) {
        // reset page to 1 to avoid invalid page number when page size changed
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

  // add filter params to urlParams when the filter form are submitted
  const onFormSubmitted = useCallback(
    (val: FiltersType) => {
      // reset page to 1 to avoid invalid page number
      setCurrentPage(1);
      setUrlParams({
        ...urlParams,
        ...filterFormToParams(val),
      });
    },
    [urlParams, filterFormToParams]
  );

  // reset page to 1 to avoid invalid page number when record counts changed
  useEffect(() => {
    setCurrentPage(1);
  }, [data?.count]);

  // cut the data to fit the page size
  const dataLength = data?.results?.length ?? 0;
  const dataSource =
    dataLength > pageSize ? data?.results?.slice(0, pageSize) : data?.results;

  const renderTableHeader = () => (
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
      {allowCreate && (
        <Button
          icon={<PlusOutlined />}
          onClick={() => alert("not implemented")}
        >
          Add
        </Button>
      )}
      {allowUploadCsv && (
        <Button
          icon={<UploadOutlined />}
          onClick={() => alert("not implemented")}
        >
          Upload CSV
        </Button>
      )}
      {allowDownloadCsv && (
        <Button
          icon={<DownloadOutlined />}
          onClick={() => alert("not implemented")}
        >
          Download CSV
        </Button>
      )}
    </Space>
  );

  const showTable = !(hideIfEmpty && dataLength === 0);

  return (
    <>
      {showTable && (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Title level={5}>{title}</Typography.Title>
          <FiltersForm
            {...filterFormProps}
            filterFormItems={filterFormItems}
            onSubmit={onFormSubmitted}
            disabled={loading}
          />
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
              position: ["bottomLeft"],
            }}
            title={hideTableHeader ? undefined : renderTableHeader}
            onRow={getRowProps}
            onChange={onTableChanged}
            {...tableProps}
          />
        </Space>
      )}
    </>
  );
}

function FiltersForm<FiltersType>(
  props: {
    filterFormItems?: React.ReactNode;
    onSubmit?: FormProps<FiltersType>["onFinish"];
  } & FormProps<FiltersType>
) {
  const { filterFormItems, onSubmit = doNothing, ...filterFormProps } = props;

  return (
    <>
      {filterFormItems && (
        <Form
          size="small"
          layout="inline"
          {...filterFormProps}
          onFinish={onSubmit}
          wrapperCol={{
            style: { margin: "4px 0" },
          }}
        >
          {filterFormItems}
          <Form.Item label=" " colon={false}>
            <Button type="primary" htmlType="submit">
              Apply Filters
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
}
