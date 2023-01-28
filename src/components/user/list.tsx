import { Form } from "antd";
import { ColumnsType } from "antd/es/table";
import api, { Role, User } from "../../api";
import { useAuth } from "../auth-context";
import { SimpleRestApiSelect } from "../form-select-item";
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
  {
    title: "Email",
    dataIndex: "email",
    width: "16em",
  },
];

function formatRoleLabel(role: Role) {
  return role.name;
}
export function UserList(props: {}) {
  useAuth({ rolesPermitted: ["staff", "admin"] });
  useRootPageTitle("Users");

  return (
    <SimpleRestApiTable
      api={api.user}
      formatItemPath={({ id }) => `/users/${id}`}
      columns={USER_COLUMNS}
      allowSearch
      filterFormItems={
        <>
          <Form.Item label="Role" name="roles_contain">
            <SimpleRestApiSelect
              api={api.role}
              formatLabel={formatRoleLabel}
              style={{ minWidth: "8em" }}
            />
          </Form.Item>
        </>
      }
    />
  );
}
