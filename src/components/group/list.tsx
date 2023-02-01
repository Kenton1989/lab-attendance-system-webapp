import { Form } from "antd";
import { ColumnsType } from "antd/es/table";
import api, { Group } from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { CourseSelect, LabSelect, UserSelect } from "../form-select-item";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";

export const GROUP_COLUMNS: ColumnsType<Group> = [
  {
    title: "Course",
    dataIndex: ["course", "code"],
    width: "6em",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Lab",
    dataIndex: ["lab", "username"],
    width: "6em",
  },
  {
    title: "Room",
    dataIndex: ["room_no"],
    width: "6em",
  },
];

const READABLE_ROLES = ["staff", "admin"];
const CREATABLE_ROLES = ["admin"];

export function GroupList(props: {}) {
  useRootPageTitle("Groups");
  useAuth({ rolesPermitted: READABLE_ROLES });
  const canCreate = useHasRole(CREATABLE_ROLES);

  return (
    <SimpleRestApiTable
      api={api.group}
      formatItemPath={({ id }) => `/groups/${id}`}
      columns={GROUP_COLUMNS}
      allowSearch
      allowCreate={canCreate}
      allowUploadCsv={canCreate}
      allowDownloadCsv
      filterFormItems={
        <>
          <Form.Item label="Course" name="course">
            <CourseSelect />
          </Form.Item>
          <Form.Item label="Lab" name="lab">
            <LabSelect />
          </Form.Item>
          <Form.Item label="Group Supervisor" name="supervisors_contain">
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
  );
}
