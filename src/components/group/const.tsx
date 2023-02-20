import { ColumnsType } from "antd/es/table";
import { Group, GroupStudent, RequestOptions } from "../../api";

export const LISTABLE_ROLES = ["staff", "admin"];
export const CREATABLE_ROLES = ["staff", "admin"];
export const DESTROYABLE_ROLES = ["admin"];

export const GROUP_COLUMNS: ColumnsType<Group> = [
  {
    title: "Course",
    dataIndex: ["course", "code"],
    width: "6em",
  },
  {
    title: "Group",
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

export function formatGroupItemPath(group: Group) {
  return `/groups/${group.id}`;
}

export const GROUP_RETRIEVE_PARAMS: RequestOptions<Group> = {
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

export const GROUP_STUDENT_RETRIEVE_PARAMS: RequestOptions<GroupStudent> = {
  urlParams: {
    fields: ["id", "student", "group", "group_id", "seat"],
  },
};
