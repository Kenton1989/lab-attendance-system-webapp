import { ColumnsType } from "antd/es/table";
import api, { Course } from "../../api";
import { useAuth } from "../auth-context";
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

export function CourseList(props: {}) {
  useAuth({ rolesPermitted: ["staff", "admin"] });
  useRootPageTitle("courses");

  return (
    <SimpleRestApiTable
      api={api.course}
      formatItemPath={({ id }) => `/courses/${id}`}
      columns={COURSE_COLUMNS}
      // allowSearch
      // allowCreate
    />
  );
}
