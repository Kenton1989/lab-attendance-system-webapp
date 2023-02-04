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

  disableUpdate?: boolean;
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

    disableUpdate = false,
    allowDelete = false,
    hideIsActiveItem = false,
  } = props;

  const [msg, msgCtx] = useMessage();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    const data = await api.retrieve(dataId, additionalRetrieveOptions);
    const canUpdate =
      !disableUpdate &&
      (await api.canUpdate(dataId, additionalCanUpdateOptions));
    return { data, canUpdate };
  }, [
    api,
    dataId,
    disableUpdate,
    additionalRetrieveOptions,
    additionalCanUpdateOptions,
  ]);

  const { data, loading, reload } = useApiData(loadData);

  const [form] = Form.useForm();

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
      await api.update(dataId, formToData(val), additionalUpdateOptions);
      msg.open({
        type: "success",
        content: "successfully updated",
      });
      setEditing(false);
      await reload();
    },
    [api, dataId, formToData, additionalUpdateOptions, reload, msg]
  );

  const onDeleteConfirm = useCallback(async () => {
    setEditing(true);
    await api.destroy(dataId, additionalDeleteOptions);
    msg.open({
      type: "success",
      content: "successfully deleted",
    });
    navigate(redirectAfterDelete);
    setEditing(false);
  }, [
    msg,
    api,
    dataId,
    additionalDeleteOptions,
    navigate,
    redirectAfterDelete,
  ]);

  const canUpdate = !disableUpdate && !loading && !editing && data?.canUpdate;

  return (
    <>
      {msgCtx}
      <Form disabled={!canUpdate} form={form} onFinish={onFinish}>
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
            </Space>
          </Form.Item>
        )}
      </Form>
    </>
  );
}
