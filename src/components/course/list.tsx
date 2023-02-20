import { Form } from "antd";
import api from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { UserSelect } from "../form";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";
import {
  COURSE_COLUMNS,
  CREATABLE_ROLES,
  formatCourseItemPath,
  LISTABLE_ROLES,
} from "./const";

export function CourseList(props: {}) {
  useRootPageTitle("Courses");
  useAuth({ rolesPermitted: LISTABLE_ROLES });
  const canCreate = useHasRole(CREATABLE_ROLES);

  return (
    <SimpleRestApiTable
      api={api.course}
      formatItemPath={formatCourseItemPath}
      columns={COURSE_COLUMNS}
      createItemPath="/courses/new"
      allowSearch
      allowCreate={canCreate}
      allowUploadCsv={canCreate}
      allowDownloadCsv
      filterFormItems={
        <>
          <Form.Item label="Course Coordinator" name="coordinators_contain">
            <UserSelect />
          </Form.Item>
        </>
      }
      // allowCreate
    />
  );
}
