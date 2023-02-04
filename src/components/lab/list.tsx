import { Form } from "antd";
import { ColumnsType } from "antd/es/table";
import api, { Lab } from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { UserSelect } from "../form";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";

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

const READABLE_ROLES = ["staff", "admin"];
const CREATABLE_ROLES = ["admin"];

export function LabList(props: {}) {
  useRootPageTitle("Labs");
  useAuth({ rolesPermitted: READABLE_ROLES });
  const canCreate = useHasRole(CREATABLE_ROLES);

  return (
    <SimpleRestApiTable
      api={api.lab}
      formatItemPath={({ id }) => `/labs/${id}`}
      columns={LAB_COLUMNS}
      allowSearch={false}
      allowCreate={canCreate}
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
