import { Form, Input, InputNumber } from "antd";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../auth-context";
import { useApiData } from "../backend";
import {
  CourseSelect,
  LabSelect,
  REQUIRED_FIELD_RULE,
  SimpleRestApiCreateForm,
  UserSelect,
} from "../form";
import { useRootPageTitle } from "../root-page-context";
import { CREATABLE_ROLES, formatGroupItemPath } from "./const";

export function CreateGroup(props: {}) {
  useRootPageTitle(["groups", "new"]);
  useAuth({ rolesPermitted: CREATABLE_ROLES });

  const [params] = useSearchParams();
  const courseId = params.get("course");

  const loadCourse = useCallback(async () => {
    if (!courseId) return;
    return [await api.course.retrieve(courseId)];
  }, [courseId]);

  const { data: courseArr, loading } = useApiData(loadCourse);

  const [form] = Form.useForm();
  useEffect(() => {
    if (courseArr) {
      form.setFieldValue("course_id", courseArr[0].id);
    }
  }, [form, courseArr]);

  return (
    <SimpleRestApiCreateForm
      form={form}
      api={api.group}
      formatItemPath={formatGroupItemPath}
      formItems={
        <>
          <Form.Item label="Course" name="course_id">
            <CourseSelect persistDataOptions={courseArr} disabled={loading} />
          </Form.Item>
          <Form.Item
            label="Group Name"
            name={"name"}
            rules={[REQUIRED_FIELD_RULE]}
          >
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item label="Lab" name={"lab_id"} rules={[REQUIRED_FIELD_RULE]}>
            <LabSelect />
          </Form.Item>
          <Form.Item label="Room">
            <InputNumber min={1} max={50} />
          </Form.Item>
          <Form.Item label="Supervisors" name="supervisor_ids">
            <UserSelect mode="multiple" role="staff" />
          </Form.Item>
          <Form.Item label="TAs" name="teacher_ids">
            <UserSelect mode="multiple" role="teacher" />
          </Form.Item>
        </>
      }
    />
  );
}
