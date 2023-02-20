import { Button, Form, FormProps } from "antd";
import useMessage from "antd/es/message/useMessage";
import { StatusCodes } from "http-status-codes";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Http4xxError, RequestOptions, SimpleRestApi } from "../../api";

export type SimpleRestApiCreateFormProps<
  DataT extends {},
  FormValueT extends {} = DataT
> = {
  api: SimpleRestApi<DataT>;
  formItems?: ReactNode;
  prefilledParts?: FormValueT;

  additionalCreateRequestOptions?: RequestOptions<DataT>;
  formatItemPath?: (data: DataT) => string;

  onCreationError?: (e: any) => unknown;

  dataToForm?: (data: DataT) => FormValueT;
  formToData?: (values: FormValueT) => DataT;
} & FormProps<FormValueT>;

export function SimpleRestApiCreateForm<
  DataT extends {},
  FormValueT extends {} = DataT
>(props: SimpleRestApiCreateFormProps<DataT, FormValueT>) {
  const {
    api,
    formItems,
    prefilledParts = {} as FormValueT,

    formToData = identity,

    additionalCreateRequestOptions,
    formatItemPath,

    onCreationError = throwIfNot4xxError,

    form: parentForm,
  } = props;

  const [childForm] = Form.useForm<FormValueT>();
  const [msg, msgCtx] = useMessage();
  const form = parentForm || childForm;
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    form.setFieldsValue(prefilledParts as any);
  }, [form, prefilledParts]);

  const onFinish = useCallback(
    async (values: FormValueT) => {
      setCreating(true);
      const data = formToData(values);

      let newInstance: DataT;

      try {
        newInstance = await api.create(data, additionalCreateRequestOptions);
      } catch (e) {
        onCreationError(e);

        if (!(e instanceof Http4xxError)) {
          msg.open({
            type: "error",
            content: `failed to create`,
          });
          return;
        }

        if (e.status === StatusCodes.FORBIDDEN) {
          msg.open({
            type: "error",
            content: "you don't have permission of creation",
          });
        } else {
          msg.open({
            type: "error",
            content: `failed to create (code: ${e.status})`,
          });
        }

        return;
      } finally {
        setCreating(false);
      }

      msg.open({
        type: "success",
        content: "new data created",
      });

      if (formatItemPath) {
        const redirect = formatItemPath(newInstance);
        navigate(redirect);
      }
    },
    [
      formatItemPath,
      onCreationError,
      additionalCreateRequestOptions,
      api,
      formToData,
      navigate,
      msg,
    ]
  );

  return (
    <Form form={form} onFinish={onFinish} disabled={creating}>
      {msgCtx}
      {formItems}
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
}

function identity(val: any) {
  return val;
}

function throwIfNot4xxError(e: any) {
  if (!(e instanceof Http4xxError)) throw e;
}
