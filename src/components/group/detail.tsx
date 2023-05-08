import { Form, Input, InputNumber, Space } from "antd";
import {} from "antd/es/select";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api, { Group, GroupStudent, StudentMakeUpSession } from "../../api";
import {
  LabSelect,
  REQUIRED_FIELD_RULE,
  SimpleRestApiUpdateForm,
  UserSelect,
} from "../form";
import { SESSION_COLUMNS } from "../session/list";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";
import { useHasRole } from "../auth-context";
import { ColumnsType } from "antd/es/table";
import { GROUP_RETRIEVE_PARAMS } from "./const";

export function GroupDetail(props: {}) {
  const { groupId } = useParams();
  const [group, setGroup] = useState<Group>();
  const [canUpdateGroup, setCanUpdateGroup] = useState(false);
  const allowDelete = useHasRole(["admin"]);

  useRootPageTitle(
    group
      ? ["group", group.course?.code!, group.name!]
      : ["group", "loading..."]
  );

  const onDataLoaded = useCallback((val: Group, canUpdate: boolean) => {
    setCanUpdateGroup(canUpdate);
    setGroup(val);
  }, []);

  const groupIdUrlParam = useMemo(() => ({ group: groupId }), [groupId]);

  if (!groupId) {
    return <></>;
  }

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <SimpleRestApiUpdateForm
        api={api.group}
        dataId={groupId}
        onDataLoaded={onDataLoaded}
        additionalRetrieveOptions={GROUP_RETRIEVE_PARAMS}
        allowDelete={allowDelete}
        redirectAfterDelete={`/courses/${group?.course?.id}`}
        formItems={
          <>
            <Form.Item label="Course" name={["course", "code"]}>
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Group Name"
              name={"name"}
              rules={[REQUIRED_FIELD_RULE]}
            >
              <Input maxLength={20} />
            </Form.Item>
            <Form.Item
              label="Lab"
              name={"lab_id"}
              rules={[REQUIRED_FIELD_RULE]}
            >
              <LabSelect />
            </Form.Item>
            <Form.Item label="Room">
              <InputNumber min={1} max={50} />
            </Form.Item>
            <Form.Item label="Supervisors" name="supervisor_ids">
              <UserSelect
                mode="multiple"
                role="staff"
                persistDataOptions={group?.supervisors}
              />
            </Form.Item>
            <Form.Item label="TAs" name="teacher_ids">
              <UserSelect
                mode="multiple"
                role="teacher"
                persistDataOptions={group?.teachers}
              />
            </Form.Item>
          </>
        }
      />

      <SimpleRestApiTable
        title="Sessions"
        api={api.session}
        formatItemPath={({ id }) => `/sessions/${id}`}
        columns={SESSION_COLUMNS}
        additionalListUrlParams={groupIdUrlParam}
        allowCreate={canUpdateGroup}
        // allowUploadCsv={canUpdateGroup}
        // allowDownloadCsv
      />

      <SimpleRestApiTable
        title="Students"
        api={api.group_student}
        formatItemPath={({ id }) => `/group_students/${id}`}
        columns={GROUP_STUDENT_COLUMNS}
        additionalListUrlParams={groupIdUrlParam}
        allowSearch
        allowCreate={canUpdateGroup}
        // allowUploadCsv={canUpdateGroup}
        // allowDownloadCsv
        defaultPageSize={50}
      />

      <SimpleRestApiTable
        title="Make Up Sessions"
        api={api.student_make_up_session}
        formatItemPath={({ id }) => `/make_up_sessions/${id}`}
        columns={MAKE_UP_SESSION_COLUMNS}
        additionalListUrlParams={groupIdUrlParam}
        allowCreate={canUpdateGroup}
        // allowUploadCsv={canUpdateGroup}
        // allowDownloadCsv
      />
    </Space>
  );
}
const GROUP_STUDENT_COLUMNS: ColumnsType<GroupStudent> = [
  {
    title: "Username",
    dataIndex: ["student", "username"],

    width: "8em",
  },
  {
    title: "Name",
    dataIndex: ["student", "display_name"],
  },
  {
    title: "Seat",
    dataIndex: "seat",
    width: "8em",
  },
];

const MAKE_UP_SESSION_COLUMNS: ColumnsType<StudentMakeUpSession> = [
  {
    title: "Student",
    children: [
      { title: "Username", dataIndex: ["user", "username"], width: "8em" },
      { title: "Name", dataIndex: ["user", "display_name"] },
    ],
  },
  {
    title: "Original Session",
    children: [
      {
        title: "Grp",
        dataIndex: ["original_session", "group", "name"],
        width: "8em",
      },
      {
        title: "Week",
        dataIndex: ["original_session", "week", "name"],
        width: "8em",
      },
    ],
  },
  {
    title: "Make Up",
    children: [
      {
        title: "Grp",
        dataIndex: ["original_session", "group", "name"],
        width: "8em",
      },
      {
        title: "Week",
        dataIndex: ["original_session", "week", "name"],
        width: "8em",
      },
    ],
  },
];
