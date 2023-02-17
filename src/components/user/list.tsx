import { Form } from "antd";
import { ColumnsType } from "antd/es/table";
import api, { User } from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { RoleSelect } from "../form";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";

export const USER_COLUMNS: ColumnsType<User> = [
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

const READABLE_ROLES = ["staff", "admin"];
const CREATABLE_ROLES = ["admin"];

export function UserList(props: {}) {
  useRootPageTitle("Users");
  useAuth({ rolesPermitted: READABLE_ROLES });
  const canCreate = useHasRole(CREATABLE_ROLES);

  return (
    <SimpleRestApiTable
      api={api.user}
      formatItemPath={({ id }) => `/users/${id}`}
      columns={USER_COLUMNS}
      allowSearch
      allowCreate={canCreate}
      allowUploadCsv={canCreate}
      allowDownloadCsv
      filterFormItems={
        <>
          <Form.Item label="Role" name="roles_contain">
            <RoleSelect />
          </Form.Item>
        </>
      }
    />
  );
}
