import { Link } from "react-router-dom";
import { useAuth } from "../auth-context";
import { useRootPageTitle } from "../root-page-context";
import { ACCESSIBLE_ROLES } from "./const";
import { Space } from "antd";

export function Settings(props: {}) {
  useRootPageTitle("settings");
  useAuth({ rolesPermitted: ACCESSIBLE_ROLES });

  return (
    <>
      <Space direction="vertical">
        <Link to="/weeks">Week settings</Link>
        <Link to="/labs">Lab settings</Link>
      </Space>
    </>
  );
}
