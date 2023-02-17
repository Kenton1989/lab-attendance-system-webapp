import { DatePicker, Form, Input, InputNumber, Space } from "antd";
import {} from "antd/es/select";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import api, { Session, RequestOptions } from "../../api";
import {
  makeDateFieldsTransformer,
  REQUIRED_FIELD_RULE,
  SimpleRestApiUpdateForm,
  SwitchFormItem,
} from "../form";
import { useRootPageTitle } from "../root-page-context";
import { useHasRole } from "../auth-context";
import { Dayjs } from "dayjs";

const SESSION_RETRIEVE_PARAMS: RequestOptions<Session> = {
  urlParams: {
    fields: [
      "id",
      "group",
      "start_datetime",
      "end_datetime",
      "week",
      "is_compulsory",
      "allow_late_check_in",
      "check_in_deadline_mins",
      "is_active",
    ],
  },
};

const { dataToForm: sessionDataToForm, formToData: sessionFormToData } =
  makeDateFieldsTransformer<Session>("start_datetime", "end_datetime");

const SHOW_TIME_FORMAT = { format: "HH:mm" };

export function SessionDetail(props: {}) {
  const { sessionId } = useParams();
  const [session, setSession] = useState<Session>();
  const allowDelete = useHasRole(["admin"]);

  const [form] = Form.useForm();
  const isCompulsory = Form.useWatch("is_compulsory", form);

  useRootPageTitle(
    session
      ? [
          "session",
          session.group?.course?.code!,
          session.group?.name!,
          session.week?.name!,
        ]
      : ["session", "loading..."]
  );

  const onDataLoaded = useCallback((val: Session, canUpdate: boolean) => {
    setSession(val);
  }, []);

  if (!sessionId) {
    return <></>;
  }

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <SimpleRestApiUpdateForm
        form={form}
        api={api.session}
        dataId={sessionId}
        onDataLoaded={onDataLoaded}
        dataToForm={sessionDataToForm}
        formToData={sessionFormToData}
        additionalRetrieveOptions={SESSION_RETRIEVE_PARAMS}
        allowDelete={allowDelete}
        formItems={
          <>
            <Form.Item label="Course" name={["group", "course", "code"]}>
              <Input disabled />
            </Form.Item>
            <Form.Item label="Group" name={["group", "name"]}>
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Start Time"
              name="start_datetime"
              rules={[REQUIRED_FIELD_RULE]}
            >
              <DatePicker showTime={SHOW_TIME_FORMAT} />
            </Form.Item>
            <Form.Item
              label="End Time"
              name="end_datetime"
              dependencies={["start_datetime"]}
              rules={[
                REQUIRED_FIELD_RULE,
                ({ getFieldValue }) => ({
                  async validator(_, endTime: Dayjs) {
                    const startTime = getFieldValue("start_datetime");
                    if (startTime && endTime && endTime.isBefore(startTime)) {
                      throw new Error(
                        "start time must be earlier than end time"
                      );
                    }
                  },
                }),
              ]}
            >
              <DatePicker showTime={SHOW_TIME_FORMAT} />
            </Form.Item>
            <SwitchFormItem label="Is Compulsory" name="is_compulsory" />
            {isCompulsory && (
              <SwitchFormItem
                label="Allow Late Check-In"
                name="allow_late_check_in"
              />
            )}
            {isCompulsory && (
              <Form.Item
                label="Check-In Deadline"
                name="check_in_deadline_mins"
                rules={[REQUIRED_FIELD_RULE]}
              >
                <InputNumber addonAfter="minute(s)" min={0} />
              </Form.Item>
            )}
          </>
        }
      />
    </Space>
  );
}
