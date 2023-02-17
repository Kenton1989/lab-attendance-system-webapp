import { Form, Input, InputNumber, Space } from "antd";
import {} from "antd/es/select";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import api, { Lab, RequestOptions } from "../../api";
import { useHasRole } from "../auth-context";
import { SimpleRestApiUpdateForm, UserSelect } from "../form";
import { useRootPageTitle } from "../root-page-context";

const LAB_RETRIEVE_PARAMS: RequestOptions<Lab> = {
  urlParams: {
    fields: [
      "id",
      "username",
      "display_name",
      "room_count",
      "executives",
      "executive_ids",
      "is_active",
    ],
  },
};

export function LabDetail(props: {}) {
  const { labId } = useParams();
  const [lab, setLab] = useState<Lab>();
  const allowDelete = useHasRole(["admin"]);

  useRootPageTitle(lab ? ["lab", lab.username!] : ["lab", "loading..."]);

  const onDataLoaded = useCallback((val: Lab) => {
    setLab(val);
  }, []);

  if (!labId) {
    return <></>;
  }

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <SimpleRestApiUpdateForm
        api={api.lab}
        dataId={labId}
        onDataLoaded={onDataLoaded}
        additionalRetrieveOptions={LAB_RETRIEVE_PARAMS}
        allowDelete={allowDelete}
        formItems={
          <>
            <Form.Item label="Username" name="username">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Lab Name" name="display_name">
              <Input />
            </Form.Item>
            <Form.Item
              label="Room Count (only increment is allowed)"
              name="room_count"
            >
              <InputNumber min={lab?.room_count} />
            </Form.Item>
            <Form.Item label="Executives" name="executive_ids">
              <UserSelect
                mode="multiple"
                persistDataOptions={lab?.executives}
              />
            </Form.Item>
          </>
        }
      />
    </Space>
  );
}
