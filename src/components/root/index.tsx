import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import "./index.css";
import { RootPageContextProvider } from "../root-page-context";
import HeaderBar from "./header-bar";
import { NavBar } from "./nav-bar";

const { Header, Sider, Content, Footer } = Layout;

export default function RootPage() {
  return (
    <RootPageContextProvider>
      <Layout id="root-page">
        <Sider breakpoint="md" collapsedWidth="0">
          <NavBar />
        </Sider>
        <Layout>
          <Header>
            <HeaderBar />
          </Header>
          <Content>
            <Outlet />
          </Content>
          <Footer>
            &copy;2023 Nanyang Technological University. All rights reserved.
          </Footer>
        </Layout>
      </Layout>
    </RootPageContextProvider>
  );
}
