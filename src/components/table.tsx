import {
  DownloadOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, FormProps, Input, Space, Table, TableProps } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback, useState } from "react";
import { SimpleRestApi, UrlParamSet, RequestOptions } from "../api";
import { useApiData } from "./backend";
import { DEFAULT_PAGE_SIZE } from "./const";

export type SimpleRestApiTableProps<DataType, FiltersType = any> = {
  api: SimpleRestApi<DataType>;
  columns: ColumnsType<DataType>;
  formatItemPath: (item: DataType) => string;
  allowSearch?: boolean;
  allowCreate?: boolean;
  allowUploadCsv?: boolean;
  allowDownloadCsv?: boolean;
  pageSize?: number;
  additionalUrlParams?: UrlParamSet<DataType>;
  additionalListRequestParams?: RequestOptions<DataType>;
  tableProps?: TableProps<DataType>;
  formProps?: FormProps<FiltersType>;
  filterFormItems?: React.ReactNode;
};

function calLimitOffset(page: number, pageSize: number) {
  return {
    limit: pageSize,
    offset: pageSize * page,
  };
}

export function SimpleRestApiTable<DataType extends object, FiltersType = any>(
  props: SimpleRestApiTableProps<DataType, FiltersType>
) {
  const {
    api,
    columns,
    formatItemPath,
    pageSize = DEFAULT_PAGE_SIZE,
    additionalUrlParams,
    additionalListRequestParams,
    allowSearch = false,
    allowCreate = false,
    allowUploadCsv = false,
    allowDownloadCsv = false,
    tableProps,
    formProps,
    filterFormItems,
  } = props;

  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(
    async (page = 0, urlParams?: UrlParamSet<DataType>) => {
      const pagination = calLimitOffset(page, pageSize);

      const data = await api.list({
        urlParams: {
          ...additionalUrlParams,
          ...pagination,
          search: searchQuery,
          ...urlParams,
        },
        ...additionalListRequestParams,
      });

      if (Array.isArray(data)) {
        throw TypeError(
          `expecting paginated result from ${api.urlBase} but got an array`
        );
      }

      return data;
    },
    [
      api,
      pageSize,
      additionalUrlParams,
      additionalListRequestParams,
      searchQuery,
    ]
  );

  const { data, loading } = useApiData(loadData);

  return (
    <>
      {filterFormItems && <Form {...formProps}>{filterFormItems}</Form>}
      <Table
        loading={loading}
        columns={columns}
        dataSource={data?.results}
        rowKey="id"
        size="small"
        pagination={{
          total: data?.count,
          defaultCurrent: 1,
          defaultPageSize: pageSize,
          hideOnSinglePage: true,
        }}
        title={() => (
          <Space>
            {allowSearch && (
              <Input.Search placeholder="search..." onSearch={setSearchQuery} />
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
        {...tableProps}
      />
    </>
  );
}
