import { Form } from "antd";
import api from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { RoleSelect } from "../form";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";
import {
  CREATABLE_ROLES,
  formatUserItemPath,
  LISTABLE_ROLES,
  USER_COLUMNS,
} from "./const";

export function UserList(props: {}) {
  useRootPageTitle("Users");
  useAuth({ rolesPermitted: LISTABLE_ROLES });
  const canCreate = useHasRole(CREATABLE_ROLES);

  return (
    <SimpleRestApiTable
      api={api.user}
      formatItemPath={formatUserItemPath}
      columns={USER_COLUMNS}
      allowSearch
      allowCreate={canCreate}
      createItemPath={"/users/new"}
      // allowUploadCsv={canCreate}
      // allowDownloadCsv
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
