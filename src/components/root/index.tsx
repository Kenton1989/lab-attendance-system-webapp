import { Layout, Typography } from "antd";
import { Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export default function RootPage() {
  return (
    <Layout>
      <Sider>
        <div style={{ width: '30vh', height: '100vh' }} />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "initial", padding: 0 }}>
          <div style={{ backgroundColor: 'yellow' }} />
        </Header>
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}