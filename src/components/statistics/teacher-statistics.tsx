import { Space } from "antd";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { UserSelect } from "../form";

export function TeacherStatistics() {
  const navigate = useNavigate();

  const onIdSelected = (value: string) => {
    navigate(`/attendance_statistics/teachers/${value}`);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space direction="horizontal">
        Teacher:
        <UserSelect onSelect={onIdSelected} role="teacher" />
      </Space>

      <Outlet />
    </Space>
  );
}

export function TeacherStatisticsDetail() {
  const { userId } = useParams();

  return <></>;
}
