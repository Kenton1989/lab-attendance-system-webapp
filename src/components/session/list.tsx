import { Form, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import api, { Session } from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { GroupSelect, LabSelect, WeekSelect } from "../form";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";

export const SESSION_COLUMNS: ColumnsType<Session> = [
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
  {
    title: "Compulsory",
    dataIndex: "is_compulsory",
    width: "8em",
    render: (val: boolean) =>
      val ? <Tag color="success">YES</Tag> : <Tag color="gray">NO</Tag>,
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
      filterFormItems={
        <>
          <Form.Item label="Group" name="group">
            <GroupSelect />
          </Form.Item>
          <Form.Item label="Lab" name="lab">
            <LabSelect />
          </Form.Item>
          <Form.Item label="Week" name="week">
            <WeekSelect />
          </Form.Item>
        </>
      }
    />
  );
}
