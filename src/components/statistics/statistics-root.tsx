import { Select, Space } from "antd";
import { useAuth } from "../auth-context";
import { useRootPageTitle } from "../root-page-context";
import { Outlet, useNavigate } from "react-router-dom";

const ACCESSIBLE_ROLES = ["staff", "admin"];
const DATA_TYPE_OPTIONS = [
  { value: "/attendance_statistics/courses", label: "Course" },
  { value: "/attendance_statistics/groups", label: "Groups" },
  { value: "/attendance_statistics/students", label: "Students" },
  { value: "/attendance_statistics/teachers", label: "Teachers" },
];

export function StatisticsRoot() {
  useRootPageTitle(["Statistics"]);
  useAuth({ rolesPermitted: ACCESSIBLE_ROLES });
  const navigate = useNavigate();

  const onDataTypeSelected = (value: string) => {
    navigate(value);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space direction="horizontal">
        Data Type:
        <Select
          options={DATA_TYPE_OPTIONS}
          style={{ minWidth: "20em" }}
          placeholder="Please select data type."
          onSelect={onDataTypeSelected}
        />
      </Space>

      <Outlet />
    </Space>
  );
}
