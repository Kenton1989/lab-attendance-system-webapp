import { Form, Input, Space } from "antd";
import {} from "antd/es/select";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api, { Course, RequestOptions } from "../../api";
import { useHasRole } from "../auth-context";
import {
  LabSelect,
  REQUIRED_FIELD_RULE,
  SimpleRestApiUpdateForm,
  UserSelect,
} from "../form";
import { GROUP_COLUMNS } from "../group/list";
import { useRootPageTitle } from "../root-page-context";
import { SimpleRestApiTable } from "../table";

const COURSE_RETRIEVE_PARAMS: RequestOptions<Course> = {
  urlParams: {
    fields: [
      "id",
      "title",
      "code",
      "coordinators",
      "coordinator_ids",
      "is_active",
    ],
  },
};

export function CourseDetail(props: {}) {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course>();
  const [canUpdateCourse, setCanUpdateCourse] = useState(false);
  const allowDelete = useHasRole(["admin"]);

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
                persistDataOptions={course?.coordinators}
              />
            </Form.Item>
          </>
        }
      />

      <SimpleRestApiTable
        title="Groups"
        api={api.group}
        formatItemPath={({ id }) => `/groups/${id}`}
        columns={GROUP_COLUMNS}
        additionalListUrlParams={listGroupUrlParam}
        allowSearch
        allowCreate={canUpdateCourse}
        allowUploadCsv={canUpdateCourse}
        allowDownloadCsv
        filterFormItems={
          <>
            <Form.Item label="Lab" name="lab">
              <LabSelect />
            </Form.Item>
            <Form.Item label="Group Supervisor" name="supervisors_contain">
              <UserSelect />
            </Form.Item>
            <Form.Item label="Student" name="students_contain">
              <UserSelect />
            </Form.Item>
            <Form.Item label="TA" name="teachers_contain">
              <UserSelect />
            </Form.Item>
          </>
        }
        // allowCreate
      />
    </Space>
  );
}
