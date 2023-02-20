import { Alert, Divider, Form, Input } from "antd";
import { useCallback, useState } from "react";
import api, { Http4xxError } from "../../api";
import { useAuth } from "../auth-context";
import {
  REQUIRED_FIELD_RULE,
  RoleSelect,
  SimpleRestApiCreateForm,
} from "../form";
import { useRootPageTitle } from "../root-page-context";
import {
  CREATABLE_ROLES,
  formatUserItemPath,
  formatUsername,
  VALIDATE_PASSWORD_CONFIRM,
} from "./const";

export function CreateUser(props: {}) {
  useRootPageTitle(["users", "new"]);
  useAuth({ rolesPermitted: CREATABLE_ROLES });

  const [passwdCheck, setPasswdCheck] = useState<string[]>();

  const onCreateError = useCallback(async (e: any) => {
    if (e instanceof Http4xxError) {
      setPasswdCheck((await e.jsonBody())?.password);
    }
  }, []);

  return (
    <SimpleRestApiCreateForm
      api={api.user}
      formatItemPath={formatUserItemPath}
      onCreationError={onCreateError}
      formItems={
        <>
          <Form.Item
            label="Username"
            name="username"
            rules={[REQUIRED_FIELD_RULE]}
          >
            <Input maxLength={50} onInput={formatUsername} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[REQUIRED_FIELD_RULE]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirm_password"
            dependencies={["password"]}
            rules={[REQUIRED_FIELD_RULE, VALIDATE_PASSWORD_CONFIRM]}
          >
            <Input.Password />
          </Form.Item>
          {passwdCheck && (
            <Form.Item>
              <Alert
                type="error"
                message="Insecure Password"
                description={passwdCheck.map((s) => (
                  <p key={s}>{s}</p>
                ))}
              />
            </Form.Item>
          )}
          <Form.Item>
            <Divider orientation="left">Profile</Divider>
          </Form.Item>
          <Form.Item
            label="Display Name"
            name="display_name"
            rules={[REQUIRED_FIELD_RULE]}
          >
            <Input maxLength={150} />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[REQUIRED_FIELD_RULE]}>
            <Input type="email" maxLength={254} />
          </Form.Item>
          <Form.Item>
            <Divider orientation="left">Permission</Divider>
          </Form.Item>
          <Form.Item
            label="Roles"
            name="role_ids"
            rules={[REQUIRED_FIELD_RULE]}
          >
            <RoleSelect mode="multiple" />
          </Form.Item>
        </>
      }
    />
  );
}
