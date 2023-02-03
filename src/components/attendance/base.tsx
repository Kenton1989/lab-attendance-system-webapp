import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { Attendance, Role } from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable, SimpleRestApiTableProps } from "../table";

function StateTag(props: { state: Attendance["check_in_state"] }) {
  const { state } = props;
  if (state === "attend") {
    return <Tag color="success">{state}</Tag>;
  }
  if (state === "late") {
    return <Tag color="error">{state}</Tag>;
  }
  return <Tag color="gray">{state}</Tag>;
}

const ATTENDANCE_COLUMN: ColumnsType<Attendance> = [
  {
    title: "Attender",
    dataIndex: ["attender", "username"],
    width: "6em",
  },
  {
    title: "Course",
    dataIndex: ["session", "group", "course", "code"],
    width: "6em",
  },
  {
    title: "Group",
    dataIndex: ["session", "group", "name"],
    width: "6em",
  },
  {
    title: "Week",
    dataIndex: ["session", "week", "name"],
    width: "6em",
  },
  {
    title: "Day",
    dataIndex: ["session", "start_datetime"],
    width: "6em",
    render: (s: string) =>
      new Date(s).toLocaleDateString(undefined, { weekday: "short" }),
  },
  {
    title: "Timestamp",
    dataIndex: "check_in_datetime",
    width: "8em",
    render: (s?: string) =>
      s
        ? new Date(s).toLocaleDateString(undefined, { weekday: "short" })
        : "N/A",
  },
  {
    title: "State",
    dataIndex: "check_in_state",
    width: "6em",
    render: (s) => <StateTag state={s} />,
  },
  {
    title: "Remark",
    dataIndex: "remark",
  },
];

export type BaseAttendancePageProps = SimpleRestApiTableProps<Attendance> & {
  title: string;
  readableRoles: string[];
  readOnly?: boolean;
  creatableRoles?: string[];
};

const EMPTY: Role[] = [];

export function BaseAttendancePage(props: BaseAttendancePageProps) {
  const { title, readableRoles, creatableRoles = EMPTY, ...tableProps } = props;

  useRootPageTitle(title);

  useAuth({ rolesPermitted: readableRoles });

  const canCreate = useHasRole(creatableRoles);

  return (
    <SimpleRestApiTable
      allowCreate={canCreate}
      allowUploadCsv={canCreate}
      allowDownloadCsv
      columns={ATTENDANCE_COLUMN}
      {...tableProps}
    />
  );
}
