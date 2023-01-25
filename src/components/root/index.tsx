import { Avatar, Button, Divider, Layout, Space, Typography } from "antd";
import { Outlet } from "react-router-dom";
import { useAuth } from "../auth-context";
import { UserOutlined } from "@ant-design/icons";
import "./index.css";

const { Header, Sider, Content, Footer } = Layout;

export default function RootPage() {
  const auth = useAuth();

  return (
    <Layout id="root-page">
      <Sider></Sider>
      <Layout>
        <Header>
          <Space direction="horizontal" align="end">
            <Avatar icon={<UserOutlined />} />
            <span>{auth.user ? auth.user.display_name : "unknown"}</span>
            <Divider type="vertical" />
            <Button type="default" danger onClick={auth.logout}>
              Logout
            </Button>
          </Space>
        </Header>
        <Content>
          <Outlet />
        </Content>
        <Footer>
          &copy;2023 Nanyang Technological University. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
}
