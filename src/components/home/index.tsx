import { Button, Descriptions, Space } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../auth-context";
import { COURSE_COLUMNS } from "../course/list";
import { GROUP_COLUMNS } from "../group/list";
import { LAB_COLUMNS } from "../lab/list";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";

const CHANGE_PASSWORD_URL = "/users/me/password";

export function Home(props: {}) {
  const { auth, authOk } = useAuth({ loginRequired: true });
  useRootPageTitle("home");
  const navigate = useNavigate();

  return (
    <>
      {authOk && (
        <Space direction="vertical" style={{ width: "100%" }} size={32}>
          <Descriptions title="User Info">
            <Descriptions.Item label="Username">
              {auth.user?.username}
            </Descriptions.Item>
            <Descriptions.Item label="Display Name">
              {auth.user?.display_name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {auth.user?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Password">
              <Button
                size="small"
                onClick={() => navigate(CHANGE_PASSWORD_URL)}
              >
                Change Password
              </Button>
            </Descriptions.Item>
          </Descriptions>

          <SimpleRestApiTable
            title="Managed Labs"
            api={api.my_managed_lab}
            formatItemPath={(item) => `/labs/${item.id}`}
            columns={LAB_COLUMNS}
            hideTableHeader
            hideIfEmpty
          />

          <SimpleRestApiTable
            title="Managed Courses"
            api={api.my_managed_course}
            formatItemPath={(item) => `/courses/${item.id}`}
            columns={COURSE_COLUMNS}
            hideTableHeader
            hideIfEmpty
          />

          <SimpleRestApiTable
            title="Managed Groups"
            api={api.my_managed_group}
            formatItemPath={(item) => `/groups/${item.id}`}
            columns={GROUP_COLUMNS}
            hideTableHeader
            hideIfEmpty
          />
        </Space>
      )}
    </>
  );
}
