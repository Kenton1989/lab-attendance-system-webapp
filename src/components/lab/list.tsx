import { Form } from "antd";
import api from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { UserSelect } from "../form";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";
import {
  CREATABLE_ROLES,
  formatLabItemPath,
  LAB_COLUMNS,
  LISTABLE_ROLES,
} from "./const";

export function LabList(props: {}) {
  useRootPageTitle("Labs");
  useAuth({ rolesPermitted: LISTABLE_ROLES });
  const canCreate = useHasRole(CREATABLE_ROLES);

  return (
    <SimpleRestApiTable
      api={api.lab}
      formatItemPath={formatLabItemPath}
      columns={LAB_COLUMNS}
      allowSearch={false}
      allowCreate={canCreate}
      createItemPath={"/labs/new"}
      allowUploadCsv={canCreate}
      allowDownloadCsv
      filterFormItems={
        <>
          <Form.Item label="Lab Executives" name="executives_contain">
            <UserSelect />
          </Form.Item>
        </>
      }
      // allowCreate
    />
  );
}
