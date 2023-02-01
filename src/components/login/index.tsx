import { useAuth } from "../auth-context";
import { Button, Form, Input, Layout, message } from "antd";
import "./index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { DEFAULT_HOME_PATH } from "../const";

const { Header, Footer, Content } = Layout;

export default function Login(props: {
  defaultRedirect?: string;
  redirectKey?: string;
}): JSX.Element {
  const { defaultRedirect = DEFAULT_HOME_PATH, redirectKey = "redirect" } =
    props;

  const { auth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectOnLogin = searchParams.get(redirectKey) ?? defaultRedirect;

  const [messageApi, contextHolder] = message.useMessage();

  type LoginForm = {
    username?: string;
    password?: string;
  };

  const onFinish = async (val: LoginForm) => {
    let success = await auth.login(val.username!, val.password!);
    if (!success) {
      messageApi.open({
        type: "error",
        content: "Failed to login: incorrect username or password",
      });
      return;
    }
    navigate(redirectOnLogin);
  };

  useEffect(() => {
    if (auth.user) {
      navigate(redirectOnLogin);
    }
  }, [auth.user, navigate, redirectOnLogin]);

  if (auth.user) {
    return <></>;
  }

  return (
    <Layout id="login-page">
      {contextHolder}
      <Header>Login</Header>
      <Content>
        <Form
          name="login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
          disabled={auth.loading}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Content>
      <Footer>
        &copy;2023 Nanyang Technological University. All rights reserved.
      </Footer>
    </Layout>
  );
}
