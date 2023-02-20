import { Form, Input } from "antd";
import api from "../../api";
import { useAuth } from "../auth-context";
import { SimpleRestApiCreateForm, UserSelect } from "../form";
import { useRootPageTitle } from "../root-page-context";
import { CREATABLE_ROLES, formatCourseItemPath } from "./const";

export function CreateCourse(props: {}) {
  useRootPageTitle(["courses", "new"]);
  useAuth({ rolesPermitted: CREATABLE_ROLES });

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
