import { Form } from "antd";
import { ColumnsType } from "antd/es/table";
import api, { Course, User } from "../../api";
import { useAuth } from "../auth-context";
import { SimpleRestApiSelect } from "../form-item";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";

const COURSE_COLUMNS: ColumnsType<Course> = [
  {
    title: "Code",
    dataIndex: "code",
    width: "6em",
    sorter: true,
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: true,
  },
];

function formatUserLabel(val: User) {
  return `${val.display_name} (${val.username})`;
}

export function CourseList(props: {}) {
  useAuth({ rolesPermitted: ["staff", "admin"] });
  useRootPageTitle("courses");

  return (
    <SimpleRestApiTable
      api={api.course}
      formatItemPath={({ id }) => `/courses/${id}`}
      columns={COURSE_COLUMNS}
      allowSearch
      filterFormItems={
        <>
          <Form.Item label="Course Coordinator" name="coordinators_contain">
            <SimpleRestApiSelect
              api={api.user}
              formatLabel={formatUserLabel}
              style={{ minWidth: "16em" }}
            />
          </Form.Item>
        </>
      }
      // allowCreate
    />
  );
}
