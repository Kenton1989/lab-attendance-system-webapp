import { Form } from "antd";
import { ColumnsType } from "antd/es/table";
import api, { Session } from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { UserSelect } from "../form-select-item";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";

const SESSION_COLUMNS: ColumnsType<Session> = [
  {
    title: "Course",
    dataIndex: ["group", "course", "code"],
    width: "6em",
  },
  {
    title: "Group",
    dataIndex: ["group", "name"],
  },
  {
    title: "Week",
    dataIndex: ["week", "name"],
    width: "8em",
  },
  {
    title: "Day",
    dataIndex: "start_datetime",
    width: "6em",
    render: (s: string) =>
      new Date(s).toLocaleDateString(undefined, { weekday: "short" }),
  },
  {
    title: "Start",
    dataIndex: "start_datetime",
    width: "8em",
    render: (s: string) => new Date(s).toLocaleTimeString(),
  },
  {
    title: "End",
    dataIndex: "end_datetime",
    width: "8em",
    render: (s: string) => new Date(s).toLocaleTimeString(),
  },
];

const READABLE_ROLES = ["staff", "admin"];
const CREATABLE_ROLES = ["admin"];

export function SessionList(props: {}) {
  useRootPageTitle("Sessions");
  useAuth({ rolesPermitted: READABLE_ROLES });
  const canCreate = useHasRole(CREATABLE_ROLES);

  return (
    <SimpleRestApiTable
      api={api.session}
      formatItemPath={({ id }) => `/sessions/${id}`}
      columns={SESSION_COLUMNS}
      allowSearch
      allowCreate={canCreate}
      allowUploadCsv={canCreate}
      allowDownloadCsv
      filterFormItems={<></>}
      // allowCreate
    />
  );
}
