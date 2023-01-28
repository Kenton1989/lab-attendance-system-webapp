import { Form } from "antd";
import { ColumnsType } from "antd/es/table";
import api, { Course } from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { UserSelect } from "../form-select-item";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";

const COURSE_COLUMNS: ColumnsType<Course> = [
  {
    title: "Code",
    dataIndex: "code",
    width: "6em",
  },
  {
    title: "Title",
    dataIndex: "title",
  },
];

const READABLE_ROLES = ["staff", "admin"];
const CREATABLE_ROLES = ["admin"];

export function CourseList(props: {}) {
  useRootPageTitle("Courses");
  useAuth({ rolesPermitted: READABLE_ROLES });
  const canCreate = useHasRole(CREATABLE_ROLES);

  return (
    <SimpleRestApiTable
      api={api.course}
      formatItemPath={({ id }) => `/courses/${id}`}
      columns={COURSE_COLUMNS}
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
