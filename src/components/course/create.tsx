import { Form, Input } from "antd";
import api, { Course } from "../../api";
import { SimpleRestApiCreateForm, UserSelect } from "../form";
import { useRootPageTitle } from "../root-page-context";

function formatCourseItemPath(course: Course) {
  return `/courses/${course.id}`;
}

export function CreateCourse(props: {}) {
  useRootPageTitle(["course", "new"]);

  return (
    <SimpleRestApiCreateForm
      api={api.course}
      formatItemPath={formatCourseItemPath}
      formItems={
        <>
          <Form.Item label="Code" name="code">
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item label="Title" name="title">
            <Input maxLength={200} />
          </Form.Item>
          <Form.Item label="Coordinators" name="coordinator_ids">
            <UserSelect mode="multiple" />
          </Form.Item>
        </>
      }
    />
  );
}
