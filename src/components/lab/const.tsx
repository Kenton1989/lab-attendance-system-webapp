import { ColumnsType } from "antd/es/table";
import { Lab, RequestOptions } from "../../api";

export const LISTABLE_ROLES = ["staff", "admin"];
export const CREATABLE_ROLES = ["admin"];
export const DESTROYABLE_ROLES = ["admin"];

export const LAB_COLUMNS: ColumnsType<Lab> = [
  {
    title: "Username",
    dataIndex: "username",
    width: "6em",
  },
  {
    title: "Name",
    dataIndex: "display_name",
  },
  {
    title: "Rooms",
    dataIndex: "room_count",
    width: "6em",
  },
];

export function formatLabItemPath(lab: Lab) {
  return `/labs/${lab.id}`;
}

export const LAB_RETRIEVE_PARAMS: RequestOptions<Lab> = {
  urlParams: {
    fields: [
      "id",
      "username",
      "display_name",
      "room_count",
      "executives",
      "executive_ids",
      "is_active",
    ],
  },
};
