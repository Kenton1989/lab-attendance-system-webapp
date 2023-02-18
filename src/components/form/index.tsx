import { Form, FormItemProps, Switch, SwitchProps } from "antd";
import { LabeledValue } from "antd/es/select";

export * from "./simple-api-update-form";
export * from "./select-item";
export * from "./date-time-item";

export function SwitchFormItem(props: FormItemProps & SwitchProps) {
  return (
    <Form.Item valuePropName="checked" {...props}>
      <Switch {...props} />
    </Form.Item>
  );
}

export const REQUIRED_FIELD_RULE = {
  required: true,
  message: "this field cannot be empty",
};

export const CHECK_IN_STATE_OPTIONS: LabeledValue[] = [
  {
    label: "attend",
    value: "attend",
  },
  {
    label: "absent",
    value: "absent",
  },
  {
    label: "late",
    value: "late",
  },
];
