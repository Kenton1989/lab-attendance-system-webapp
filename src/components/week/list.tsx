import { ColumnsType } from "antd/es/table";
import api, { Week } from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";

export const WEEK_COLUMNS: ColumnsType<Week> = [
  {
    title: "Name",
    dataIndex: "name",
    width: "8em",
  },
  {
    title: "Start",
    dataIndex: "monday",
    width: "12em",
  },
  {
    title: "End",
    dataIndex: "next_monday",
  },
];

const READABLE_ROLES = ["staff", "admin"];
const CREATABLE_ROLES = ["admin"];

export function WeekList(props: {}) {
  useRootPageTitle("Weeks");
  useAuth({ rolesPermitted: READABLE_ROLES });
  const canCreate = useHasRole(CREATABLE_ROLES);

  return (
    <SimpleRestApiTable
      api={api.week}
      formatItemPath={({ id }) => `/weeks/${id}`}
      columns={WEEK_COLUMNS}
      defaultPageSize={20}
      allowSearch
      allowCreate={canCreate}
      // allowUploadCsv={canCreate}
      // allowDownloadCsv
      // allowCreate
    />
  );
}
