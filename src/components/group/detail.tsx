import { Form, Input, InputNumber, Space } from "antd";
import {} from "antd/es/select";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api, { Group, RequestOptions } from "../../api";
import { LabSelect, SimpleRestApiUpdateForm, UserSelect } from "../form";
import { SESSION_COLUMNS } from "../session/list";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";
import { useHasRole } from "../auth-context";

const GROUP_RETRIEVE_PARAMS: RequestOptions<Group> = {
  urlParams: {
    fields: [
      "id",
      "course",
      "name",
      "is_active",
      "lab",
      "lab_id",
      "room_no",
      "supervisor_ids",
      "supervisors",
      "teacher_ids",
      "teachers",
    ],
  },
};

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

  const listSessionUrlParam = useMemo(() => ({ group: groupId }), [groupId]);

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
        formItems={
          <>
            <Form.Item label="Course Code" name={["course", "code"]}>
              <Input disabled />
            </Form.Item>
            <Form.Item label="Group Name" name={"name"} required>
              <Input />
            </Form.Item>
            <Form.Item label="Lab" name={"lab_id"} required>
              <LabSelect />
            </Form.Item>
            <Form.Item label="Room">
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item label="Supervisors" name="supervisor_ids">
              <UserSelect
                mode="multiple"
                persistDataOptions={group?.supervisors}
              />
            </Form.Item>
            <Form.Item label="TAs" name="teacher_ids">
              <UserSelect
                mode="multiple"
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
        additionalListUrlParams={listSessionUrlParam}
        allowSearch
        allowCreate={canUpdateGroup}
        allowUploadCsv={canUpdateGroup}
        allowDownloadCsv
        filterFormItems={
          <>
            <Form.Item label="Lab" name="lab">
              <LabSelect />
            </Form.Item>
            <Form.Item label="Session Supervisor" name="supervisors_contain">
              <UserSelect />
            </Form.Item>
            <Form.Item label="Student" name="students_contain">
              <UserSelect />
            </Form.Item>
            <Form.Item label="TA" name="teachers_contain">
              <UserSelect />
            </Form.Item>
          </>
        }
        // allowCreate
      />
    </Space>
  );
}
