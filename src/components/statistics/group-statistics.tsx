import { Space } from "antd";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { CourseSelect, GroupSelect } from "../form";
import { useState } from "react";
import { Group, UrlParamSet } from "../../api";

export function GroupStatistics() {
  const navigate = useNavigate();

  const [groupParams, setGroupParams] = useState<UrlParamSet<Group>>({});

  const onIdSelected = (value: string) => {
    navigate(`/attendance_statistics/groups/${value}`);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space direction="horizontal">
        Course:
        <CourseSelect onChange={(id) => setGroupParams({ course: id })} />
        Group:
        <GroupSelect
          onSelect={onIdSelected}
          additionalListUrlParams={groupParams}
        />
      </Space>

      <Outlet />
    </Space>
  );
}

export function GroupStatisticsDetail() {
  const { groupId } = useParams();

  return <></>;
}
