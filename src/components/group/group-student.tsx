import { Form, Input, Space } from "antd";
import {} from "antd/es/select";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api, { GroupStudent } from "../../api";
import { useHasRole } from "../auth-context";
import { GroupSelect, SimpleRestApiUpdateForm } from "../form";
import {} from "../group/list";
import { useRootPageTitle } from "../root-page-context";
import {} from "../table";
import { GROUP_STUDENT_RETRIEVE_PARAMS } from "./const";

export function GroupStudentDetail(props: {}) {
  const { groupStudentId } = useParams();
  const [groupStudent, setGroupStudent] = useState<GroupStudent>();
  const [canUpdateGroup, setCanUpdateGroup] = useState(false);
  const isAdmin = useHasRole(["admin"]);

  useRootPageTitle(
    groupStudent
      ? [
          "student",
          groupStudent.group?.course?.code!,
          groupStudent.student?.username!,
        ]
      : ["student", "loading..."]
  );

  const onDataLoaded = useCallback(
    async (val: GroupStudent, canUpdate: boolean) => {
      setGroupStudent(val);
      setCanUpdateGroup(await api.group.canUpdate(val.group?.id!));
    },
    []
  );

  const courseIdUrlParam = useMemo(
    () => ({
      course: groupStudent?.group?.course?.id,
    }),
    [groupStudent]
  );

  if (!groupStudentId) {
    return <></>;
  }

  const allowDelete = isAdmin || canUpdateGroup;

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <SimpleRestApiUpdateForm
        api={api.group_student}
        dataId={groupStudentId}
        onDataLoaded={onDataLoaded}
        additionalRetrieveOptions={GROUP_STUDENT_RETRIEVE_PARAMS}
        allowDelete={allowDelete}
        redirectAfterDelete={`/groups/${groupStudent?.group?.id}`}
        formItems={
          <>
            <Form.Item label="Student" name={["student", "username"]}>
              <Input disabled />
            </Form.Item>
            <Form.Item label="Group" name="group_id">
              <GroupSelect additionalListUrlParams={courseIdUrlParam} />
            </Form.Item>
            <Form.Item label="Seat" name="seat">
              <Input maxLength={20} />
            </Form.Item>
          </>
        }
      />
    </Space>
  );
}
