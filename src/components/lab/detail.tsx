import { Alert, Form, Input, InputNumber, Space } from "antd";
import {} from "antd/es/select";
import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { Lab } from "../../api";
import { useHasRole } from "../auth-context";
import { SimpleRestApiUpdateForm, UserSelect } from "../form";
import { useRootPageTitle } from "../root-page-context";
import { LAB_RETRIEVE_PARAMS } from "./const";

export function LabDetail(props: {}) {
  const { labId } = useParams();
  const [lab, setLab] = useState<Lab>();
  const [canUpdateLab, setCanUpdateLab] = useState(false);
  const allowDelete = useHasRole(["admin"]);

  useRootPageTitle(lab ? ["lab", lab.username!] : ["lab", "loading..."]);

  const onDataLoaded = useCallback((val: Lab, canUpdate: boolean) => {
    setLab(val);
    setCanUpdateLab(canUpdate);
  }, []);

  if (!labId) {
    return <></>;
  }

  const changeUsernameHint = (
    <>
      to update username and display name of lab, please go to{" "}
      <Link to={`/users/${labId}`}>the corresponding user page</Link>.
    </>
  );

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
              <Input disabled />
            </Form.Item>
            {canUpdateLab && (
              <Form.Item>
                <Alert type="info" message={changeUsernameHint} />
              </Form.Item>
            )}
            <Form.Item
              label="Room Count (only increment is allowed)"
              name="room_count"
            >
              <InputNumber min={lab?.room_count} />
            </Form.Item>
            <Form.Item label="Executives" name="executive_ids">
              <UserSelect
                mode="multiple"
                role="staff"
                persistDataOptions={lab?.executives}
              />
            </Form.Item>
          </>
        }
      />
    </Space>
  );
}
