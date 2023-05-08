import { Space } from "antd";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { CourseSelect } from "../form";

export function CourseStatistics() {
  const navigate = useNavigate();

  const onIdSelected = (value: string) => {
    navigate(`/attendance_statistics/courses/${value}`);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space direction="horizontal">
        Course:
        <CourseSelect onSelect={onIdSelected} />
      </Space>

      <Outlet />
    </Space>
  );
}

export function CourseStatisticsDetail() {
  const { courseId } = useParams();

  return <></>;
}
