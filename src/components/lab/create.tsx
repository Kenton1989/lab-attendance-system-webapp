import { Alert, Form, InputNumber } from "antd";
import { Link } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../auth-context";
import {
  REQUIRED_FIELD_RULE,
  SimpleRestApiCreateForm,
  UserSelect,
} from "../form";
import { useRootPageTitle } from "../root-page-context";
import { CREATABLE_ROLES, formatLabItemPath } from "./const";

export function CreateLab(props: {}) {
  useRootPageTitle(["labs", "new"]);
  useAuth({ rolesPermitted: CREATABLE_ROLES });

  const userCreationGuide = (
    <>
      You may need to create a user with lab role
      <Link to="/users/new">here</Link>, before create a lab
    </>
  );
  return (
    <SimpleRestApiCreateForm
      api={api.lab}
      formatItemPath={formatLabItemPath}
      formItems={
        <>
          <Form.Item>
            <Alert type="info" message={userCreationGuide} />
          </Form.Item>
          <Form.Item label="User" name="id" rules={[REQUIRED_FIELD_RULE]}>
            <UserSelect role="lab" />
          </Form.Item>
          <Form.Item
            label="Room Count"
            name="room_count"
            rules={[REQUIRED_FIELD_RULE]}
          >
            <InputNumber min={1} max={100} />
          </Form.Item>
          <Form.Item label="Executives" name="executive_ids">
            <UserSelect mode="multiple" role="staff" />
          </Form.Item>
        </>
      }
    />
  );
}
