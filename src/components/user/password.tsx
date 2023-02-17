import { Alert, Button, Form, Input, Typography } from "antd";
import useMessage from "antd/es/message/useMessage";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { Http4xxError } from "../../api";
import { useAuth, useHasRole } from "../auth-context";
import { useApiData } from "../backend";
import { DEFAULT_404_PATH } from "../const";
import { REQUIRED_FIELD_RULE } from "../form";
import { useRootPageTitle } from "../root-page-context";

export function ChangePassword(props: {}) {
  const { auth } = useAuth({ loginRequired: true });
  const { userId } = useParams();
  const navigate = useNavigate();
  const [msg, msgCtx] = useMessage();
  const [passwdCheck, setPasswdCheck] = useState<string[]>();

  const isUserSelf = userId === "me" || userId === `${auth?.user?.id}`;
  const isAdmin = useHasRole(["admin"]);
  const canChangePassword = isAdmin || isUserSelf;

  useEffect(() => {
    if (!canChangePassword) {
      navigate(DEFAULT_404_PATH);
    }
  }, [canChangePassword, navigate]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    return await api.user.retrieve(userId);
  }, [userId]);

  const { data, loading, reload } = useApiData(loadData);

  useRootPageTitle(["users", data ? data.username! : "loading...", "password"]);

  const submitPassword = useCallback(
    async (values: { password: string }) => {
      const { password } = values;
      try {
        await api.user.update(userId!, { password });
        msg.open({ type: "success", content: "password updated" });
      } catch (e) {
        msg.open({ type: "error", content: "failed to updated" });
        console.error(e);
        if (e instanceof Http4xxError) {
          setPasswdCheck((await e.jsonBody())?.password);
        }
      }
      await reload();
    },
    [userId, reload, msg]
  );

  return (
    <Form
      disabled={loading || !canChangePassword}
      onFinish={submitPassword}
      onFinishFailed={() =>
        msg.open({
          type: "error",
          content: "failed to submit, please check the form ",
        })
      }
    >
      {msgCtx}
      <Form.Item>
        <Typography.Title level={5}>
          Changing Password for {data?.username ?? "..."}
        </Typography.Title>
      </Form.Item>
      <Form.Item
        label="New Password"
        name="password"
        rules={[REQUIRED_FIELD_RULE]}
      >
        <Input type="password" />
      </Form.Item>
      <Form.Item
        label="Confirm Password"
        name="confirm_password"
        dependencies={["password"]}
        rules={[
          REQUIRED_FIELD_RULE,
          ({ getFieldValue }) => ({
            async validator(_, confirmValue) {
              const enteredValue = getFieldValue("password");
              if (enteredValue && enteredValue !== confirmValue) {
                throw new Error("two passwords you entered do not match");
              }
            },
          }),
        ]}
      >
        <Input type="password" />
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
        <Button type="primary" htmlType="submit">
          Change Password
        </Button>
      </Form.Item>
    </Form>
  );
}
