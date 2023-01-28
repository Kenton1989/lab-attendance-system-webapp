import { Avatar, Breadcrumb, Button, Divider, Row, Col, Space } from "antd";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useAuth } from "../auth-context";
import { useNavigate } from "react-router-dom";
import { useRootPage } from "../root-page-context";

function titleToBreadcrumb(nameList: string[]) {
  if (nameList.length === 1 && nameList[0] === "") nameList[0] = "home";

  return (
    <Breadcrumb>
      {nameList.map((s) => (
        <Breadcrumb.Item key={s}>{s.toUpperCase()}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

export default function HeaderBar(props: {}) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { title } = useRootPage();

  return (
    <Row align="middle" justify="end" gutter={8}>
      <Col>
        <Button
          icon={<ArrowLeftOutlined />}
          type="ghost"
          onClick={() => navigate(-1)}
        />
      </Col>
      <Col>{titleToBreadcrumb(title)}</Col>
      <Col flex="auto"></Col>
      <Col>
        <Space>
          <Avatar icon={<UserOutlined />} />
          <span>{auth.user ? auth.user.display_name : "unknown"}</span>
          <Divider type="vertical" />
          <Button type="default" danger onClick={() => auth.logout()}>
            Logout
          </Button>
        </Space>
      </Col>
    </Row>
  );
}
