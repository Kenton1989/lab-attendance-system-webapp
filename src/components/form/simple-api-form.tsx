import { Button, Form, FormProps, Popconfirm, Space } from "antd";
import useMessage from "antd/es/message/useMessage";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SwitchFormItem } from ".";
import {
  CanUpdateRequestOptions,
  RequestOptions,
  SimpleRestApi,
} from "../../api";
import { useApiData } from "../backend";

function identity(val: any) {
  return val;
}

function doNothing() {}

type SimpleRestApiUpdateFormProps<DataT, FormValueT = DataT> = {
  api: SimpleRestApi<DataT>;
  dataId: number | string;
  formItems?: ReactNode;

  dataToForm?: (data: DataT) => FormValueT;
  formToData?: (values: FormValueT) => DataT;

  onDataLoaded?: (data: DataT, canUpdate: boolean) => unknown;

  additionalRetrieveOptions?: RequestOptions<DataT>;
  additionalCanUpdateOptions?: CanUpdateRequestOptions<DataT>;
  additionalUpdateOptions?: RequestOptions<DataT>;
  additionalDeleteOptions?: RequestOptions<DataT>;
  redirectAfterDelete?: string;

  allowUpdate?: boolean;
  disableAutoCheckUpdatePerm?: boolean;
  allowDelete?: boolean;
  hideIsActiveItem?: boolean;
} & FormProps<FormValueT>;

export function SimpleRestApiUpdateForm<DataT, FormValueT = DataT>(
  props: SimpleRestApiUpdateFormProps<DataT, FormValueT>
) {
  const {
    api,
    dataId,
    formItems,
    dataToForm = identity,
    formToData = identity,

    additionalRetrieveOptions,
    additionalCanUpdateOptions,
    additionalUpdateOptions,
    additionalDeleteOptions,
    redirectAfterDelete = "/",

    onDataLoaded = doNothing,

    allowUpdate,
    disableAutoCheckUpdatePerm = allowUpdate !== undefined,
    allowDelete = false,
    hideIsActiveItem = false,

    form: parentForm,
    ...formProps
  } = props;

  const [msg, msgCtx] = useMessage();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    const data = await api.retrieve(dataId, additionalRetrieveOptions);
    const canUpdate =
      !disableAutoCheckUpdatePerm &&
      (await api.canUpdate(dataId, additionalCanUpdateOptions));
    return { data, canUpdate };
  }, [
    api,
    dataId,
    disableAutoCheckUpdatePerm,
    additionalRetrieveOptions,
    additionalCanUpdateOptions,
  ]);

  const { data, loading, reload } = useApiData(loadData);

  const [childForm] = Form.useForm();
  const form = parentForm || childForm;

  useEffect(() => {
    if (data) onDataLoaded(data.data, data.canUpdate);
  }, [data, onDataLoaded]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(dataToForm(data.data));
    } else {
      form.resetFields();
    }
  }, [data, form, dataToForm]);

  const [editing, setEditing] = useState(false);

  const onFinish = useCallback(
    async (val: any) => {
      setEditing(true);
      const newData = formToData(val);
      try {
        await api.update(dataId, newData, additionalUpdateOptions);
      } catch (e: any) {
        msg.open({
          type: "error",
          content: `failed to update${e.status ? `(code: ${e.status})` : ""}`,
        });
        return;
      } finally {
        setEditing(false);
      }
      msg.open({
        type: "success",
        content: "successfully updated",
      });
      await reload();
    },
    [api, dataId, formToData, additionalUpdateOptions, reload, msg]
  );

  const onDeleteConfirm = useCallback(async () => {
    setEditing(true);
    try {
      await api.destroy(dataId, additionalDeleteOptions);
      msg.open({
        type: "success",
        content: "successfully deleted",
      });
    } catch (e) {
      msg.open({
        type: "error",
        content: "failed to update",
      });
      return;
    } finally {
      setEditing(false);
    }
    setEditing(false);
    navigate(redirectAfterDelete);
  }, [
    msg,
    api,
    dataId,
    additionalDeleteOptions,
    navigate,
    redirectAfterDelete,
  ]);

  const canUpdate = !loading && !editing && data?.canUpdate;

  return (
    <>
      {msgCtx}
      <Form
        {...formProps}
        disabled={!canUpdate}
        form={form}
        onFinish={onFinish}
        onFinishFailed={() =>
          msg.open({
            type: "error",
            content: "failed to submit, please check the form ",
          })
        }
      >
        {formItems}
        {hideIsActiveItem || (
          <SwitchFormItem label="Is Active" name="is_active" />
        )}
        {loading || (
          <Form.Item wrapperCol={{ span: 16 }}>
            <Space>
              {canUpdate && (
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              )}
              {allowDelete && (
                <Popconfirm
                  title="Confirm Delete?"
                  description="Are you sure to delete? All the related data will be deleted too."
                  onConfirm={onDeleteConfirm}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              )}
              <Button
                onClick={async () => {
                  await reload();
                  msg.open({ type: "info", content: "refreshed" });
                }}
                disabled={false}
              >
                Refresh
              </Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </>
  );
}
