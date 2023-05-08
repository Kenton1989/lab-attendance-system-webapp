import { Space } from "antd";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { UserSelect } from "../form";

export function StudentStatistics() {
  const navigate = useNavigate();

  const onIdSelected = (value: string) => {
    navigate(`/attendance_statistics/students/${value}`);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space direction="horizontal">
        Student:
        <UserSelect onSelect={onIdSelected} role="student" />
      </Space>

      <Outlet />
    </Space>
  );
}

export function StudentStatisticsDetail() {
  const { userId } = useParams();

  return <></>;
}
