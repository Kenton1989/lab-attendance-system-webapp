import { Form, FormItemProps, Switch, SwitchProps } from "antd";

export * from "./simple-api-form";
export * from "./select-item";

export function SwitchFormItem(props: FormItemProps & SwitchProps) {
  return (
    <Form.Item valuePropName="checked" {...props}>
      <Switch {...props} />
    </Form.Item>
  );
}
