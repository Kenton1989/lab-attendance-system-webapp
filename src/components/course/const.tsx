import { ColumnsType } from "antd/es/table";
import { Course, RequestOptions } from "../../api";

export const LISTABLE_ROLES = ["staff", "admin"];
export const CREATABLE_ROLES = ["admin"];
export const DESTROYABLE_ROLES = ["admin"];

export const COURSE_COLUMNS: ColumnsType<Course> = [
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

export function formatCourseItemPath(course: Course) {
  return `/courses/${course.id}`;
}

export const COURSE_RETRIEVE_PARAMS: RequestOptions<Course> = {
  urlParams: {
    fields: [
      "id",
      "title",
      "code",
      "coordinators",
      "coordinator_ids",
      "is_active",
    ],
  },
};
