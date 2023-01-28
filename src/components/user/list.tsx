import { ColumnsType } from "antd/es/table";
import api, { User } from "../../api";
import { useAuth } from "../auth-context";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";

const USER_COLUMNS: ColumnsType<User> = [
  {
    title: "Username",
    dataIndex: "username",
    width: "8em",
  },
  {
    title: "Name",
    dataIndex: "display_name",
  },
];

export function UserList(props: {}) {
  useAuth({ rolesPermitted: ["staff", "admin"] });
  useRootPageTitle("Users");

  return (
    <SimpleRestApiTable
      api={api.user}
      formatItemPath={({ id }) => `/users/${id}`}
      columns={USER_COLUMNS}
      allowSearch
      // allowCreate
    />
  );
}
