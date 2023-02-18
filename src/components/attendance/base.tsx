import { DatePicker, Form, Input, Select, Space, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { Attendance, RequestOptions, Role } from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable, SimpleRestApiTableProps } from "../table";
import {
  makeDateFieldsTransformer,
  REQUIRED_FIELD_RULE,
  SimpleRestApiUpdateForm,
  SimpleRestApiUpdateFormProps,
} from "../form";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { CHECK_IN_STATE_OPTIONS } from "../form";

function doNothing() {}

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

export type BaseAttendanceListPageProps =
  SimpleRestApiTableProps<Attendance> & {
    title: string;
    readableRoles: string[];
    readOnly?: boolean;
    creatableRoles?: string[];
  };

const EMPTY: Role[] = [];

export function BaseAttendanceListPage(props: BaseAttendanceListPageProps) {
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

export type BaseAttendanceDetailPageProps = Omit<
  SimpleRestApiUpdateFormProps<Attendance>,
  "dataId"
> & {
  titlePrefix?: string[];
};

const ATTENDANCE_RETRIEVE_PARAMS: RequestOptions<Attendance> = {
  urlParams: {
    fields: [
      "id",
      "session",
      "attender",
      "check_in_state",
      "check_in_datetime",
      "last_modify",
      "remark",
      "is_active",
    ],
  },
};

const { dataToForm: attendanceDataToForm, formToData: attendanceFormToData } =
  makeDateFieldsTransformer<Attendance>("check_in_datetime", "last_modify");

export function BaseAttendanceDetailPage(props: BaseAttendanceDetailPageProps) {
  const { attendanceId } = useParams();

  const {
    onDataLoaded: parentOnDataLoaded = doNothing,
    titlePrefix = ["attendance"],
    ...formProp
  } = props;
  const [attendance, setAttendance] = useState<Attendance>();
  const isAdmin = useHasRole(["admin"]);

  useRootPageTitle(
    attendance
      ? [
          ...titlePrefix,
          attendance.session?.group?.course?.code!,
          attendance.attender?.username!,
        ]
      : [...titlePrefix, "loading..."]
  );

  const onDataLoaded = useCallback(
    (val: Attendance, canUpdate: boolean) => {
      setAttendance(val);
      parentOnDataLoaded(val, canUpdate);
    },
    [parentOnDataLoaded]
  );

  const [form] = Form.useForm();
  const checkInState = Form.useWatch<string>("check_in_state", form);

  if (!attendanceId) {
    return <></>;
  }

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <SimpleRestApiUpdateForm
        form={form}
        dataId={attendanceId!}
        onDataLoaded={onDataLoaded}
        additionalRetrieveOptions={ATTENDANCE_RETRIEVE_PARAMS}
        allowDelete={isAdmin}
        dataToForm={attendanceDataToForm}
        formToData={attendanceFormToData}
        formItems={
          <>
            <Form.Item
              label="Course"
              name={["session", "group", "course", "code"]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item label="Group" name={["session", "group", "name"]}>
              <Input disabled />
            </Form.Item>
            <Form.Item label="Session" name={["session", "start_datetime"]}>
              <Input disabled />
            </Form.Item>
            <Form.Item label="Attender" name={["attender", "username"]}>
              <Input disabled />
            </Form.Item>
            <Form.Item label="Last Modify Time" name="last_modify">
              <DatePicker showTime disabled />
            </Form.Item>
            <Form.Item
              label="Check-In State"
              name="check_in_state"
              rules={[REQUIRED_FIELD_RULE]}
            >
              <Select options={CHECK_IN_STATE_OPTIONS} />
            </Form.Item>
            {checkInState !== "absent" && (
              <Form.Item
                label="Check-In Time"
                name="check_in_datetime"
                rules={[REQUIRED_FIELD_RULE]}
              >
                <DatePicker showTime />
              </Form.Item>
            )}
            <Form.Item
              label="Remarks"
              name="remark"
              rules={[REQUIRED_FIELD_RULE]}
            >
              <Input.TextArea maxLength={200} showCount />
            </Form.Item>
          </>
        }
        {...formProp}
      />
    </Space>
  );
}
