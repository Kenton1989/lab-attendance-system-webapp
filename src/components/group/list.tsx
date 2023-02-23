import { Form } from "antd";
import api from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { LISTABLE_ROLES } from "../course";
import { CourseSelect, LabSelect, UserSelect } from "../form";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";
import { CREATABLE_ROLES, formatGroupItemPath, GROUP_COLUMNS } from "./const";

export function GroupList(props: {}) {
  useRootPageTitle("Groups");
  useAuth({ rolesPermitted: LISTABLE_ROLES });
  const canCreate = useHasRole(CREATABLE_ROLES);

  return (
    <SimpleRestApiTable
      api={api.group}
      formatItemPath={formatGroupItemPath}
      columns={GROUP_COLUMNS}
      allowSearch
      allowCreate={canCreate}
      createItemPath="/groups/new"
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
