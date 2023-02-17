import { Button, Form, Input, Space } from "antd";
import {} from "antd/es/select";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { User, RequestOptions } from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import {
  REQUIRED_FIELD_RULE,
  RoleSelect,
  SimpleRestApiUpdateForm,
} from "../form";
import { useRootPageTitle } from "../root-page-context";

const USER_RETRIEVE_PARAMS: RequestOptions<User> = {
  urlParams: {
    fields: [
      "id",
      "username",
      "display_name",
      "email",
      "roles",
      "role_ids",
      "is_active",
    ],
  },
};

export function UserDetail(props: {}) {
  const { auth } = useAuth({ loginRequired: true });

  const { userId } = useParams();

  const [user, setUser] = useState<User>();

  useRootPageTitle(user ? ["user", user.username!] : ["user", "loading..."]);

  const isAdmin = useHasRole(["admin"]);

  const onDataLoaded = useCallback((val: User, canUpdate: boolean) => {
    setUser(val);
  }, []);

  const navigate = useNavigate();

  const isUserSelf = userId === "me" || userId === `${auth?.user?.id}`;

  const canChangePassword = user !== undefined && (isAdmin || isUserSelf);
  const allowDelete = isAdmin;
  const allowUpdate = isAdmin;

  if (!userId) {
    return <></>;
  }

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <SimpleRestApiUpdateForm
        api={api.user}
        dataId={userId}
        onDataLoaded={onDataLoaded}
        additionalRetrieveOptions={USER_RETRIEVE_PARAMS}
        allowDelete={allowDelete}
        allowUpdate={allowUpdate}
        formItems={
          <>
            <Form.Item
              label="Username"
              name="username"
              rules={[REQUIRED_FIELD_RULE]}
            >
              <Input maxLength={50} />
            </Form.Item>
            <Form.Item label="Password">
              <Button
                type="primary"
                onClick={() => navigate(`/users/${userId}/password`)}
                disabled={!canChangePassword}
              >
                Change Password
              </Button>
            </Form.Item>
            <Form.Item
              label="Display Name"
              name="display_name"
              rules={[REQUIRED_FIELD_RULE]}
            >
              <Input maxLength={100} />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[REQUIRED_FIELD_RULE]}>
              <Input type="email" />
            </Form.Item>
            <Form.Item label="Roles" name="role_ids">
              <RoleSelect mode="multiple" />
            </Form.Item>
          </>
        }
      />
    </Space>
  );
}
