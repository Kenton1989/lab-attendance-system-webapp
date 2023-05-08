import { Form, Input, Space } from "antd";
import {} from "antd/es/select";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api, { Course } from "../../api";
import { useHasRole } from "../auth-context";
import {
  LabSelect,
  REQUIRED_FIELD_RULE,
  SimpleRestApiUpdateForm,
  UserSelect,
} from "../form";
import { formatGroupItemPath, GROUP_COLUMNS } from "../group";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";
import { COURSE_RETRIEVE_PARAMS, DESTROYABLE_ROLES } from "./const";

export function CourseDetail(props: {}) {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course>();
  const [canUpdateCourse, setCanUpdateCourse] = useState(false);
  const allowDelete = useHasRole(DESTROYABLE_ROLES);

  useRootPageTitle(
    course ? ["course", course.code!] : ["course", "loading..."]
  );

  const onDataLoaded = useCallback((val: Course, canUpdate: boolean) => {
    setCanUpdateCourse(canUpdate);
    setCourse(val);
  }, []);

  const listGroupUrlParam = useMemo(() => ({ course: courseId }), [courseId]);

  if (!courseId) {
    return <></>;
  }

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <SimpleRestApiUpdateForm
        api={api.course}
        dataId={courseId}
        onDataLoaded={onDataLoaded}
        additionalRetrieveOptions={COURSE_RETRIEVE_PARAMS}
        allowDelete={allowDelete}
        redirectAfterDelete="/courses"
        formItems={
          <>
            <Form.Item label="Code" name="code">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Title" name="title" rules={[REQUIRED_FIELD_RULE]}>
              <Input maxLength={200} />
            </Form.Item>
            <Form.Item label="Coordinators" name="coordinator_ids">
              <UserSelect
                mode="multiple"
                role="staff"
                persistDataOptions={course?.coordinators}
              />
            </Form.Item>
          </>
        }
      />

      <SimpleRestApiTable
        title="Groups"
        api={api.group}
        formatItemPath={formatGroupItemPath}
        columns={GROUP_COLUMNS}
        additionalListUrlParams={listGroupUrlParam}
        allowSearch
        allowCreate={canUpdateCourse}
        createItemPath={`/groups/new?course=${courseId}`}
        // allowUploadCsv={canUpdateCourse}
        // allowDownloadCsv
        filterFormItems={
          <>
            <Form.Item label="Lab" name="lab">
              <LabSelect />
            </Form.Item>
            <Form.Item label="Group Supervisor" name="supervisors_contain">
              <UserSelect role="staff" />
            </Form.Item>
            <Form.Item label="Student" name="students_contain">
              <UserSelect role="student" />
            </Form.Item>
            <Form.Item label="TA" name="teachers_contain">
              <UserSelect role="teacher" />
            </Form.Item>
          </>
        }
        // allowCreate
      />
    </Space>
  );
}
