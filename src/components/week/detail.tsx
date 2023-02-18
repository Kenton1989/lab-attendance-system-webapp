import { DatePicker, Form, Input, Space } from "antd";
import {} from "antd/es/select";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import api, { Week, RequestOptions } from "../../api";
import {
  makeDateFieldsTransformer,
  REQUIRED_FIELD_RULE,
  SimpleRestApiUpdateForm,
} from "../form";
import { useRootPageTitle } from "../root-page-context";
import { useHasRole } from "../auth-context";
import { Dayjs } from "dayjs";

const WEEK_RETRIEVE_PARAMS: RequestOptions<Week> = {
  urlParams: {
    fields: ["id", "name", "monday", "next_monday", "is_active"],
  },
};

const { dataToForm: weekDataToForm, formToData: weekFormToData } =
  makeDateFieldsTransformer<Week>("monday", "next_monday");

const MONDAY = 1;
const MONDAY_VALIDATOR = {
  async validator(_: any, value: Dayjs) {
    if (value && value.day() !== MONDAY) {
      throw new Error("the day is not monday");
    }
  },
};

export function WeekDetail(props: {}) {
  const { weekId } = useParams();
  const [week, setWeek] = useState<Week>();
  const allowDelete = useHasRole(["admin"]);

  useRootPageTitle(week ? ["week", week.name!] : ["week", "loading..."]);

  const onDataLoaded = useCallback((val: Week) => {
    setWeek(val);
  }, []);

  if (!weekId) {
    return <></>;
  }

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <SimpleRestApiUpdateForm
        api={api.week}
        dataId={weekId}
        onDataLoaded={onDataLoaded}
        formToData={weekFormToData}
        dataToForm={weekDataToForm}
        additionalRetrieveOptions={WEEK_RETRIEVE_PARAMS}
        allowDelete={allowDelete}
        hideIsActiveItem
        formItems={
          <>
            <Form.Item
              label="Week Name"
              name={"name"}
              rules={[REQUIRED_FIELD_RULE]}
            >
              <Input maxLength={20} />
            </Form.Item>
            <Form.Item
              label="Start Monday"
              name={"monday"}
              rules={[REQUIRED_FIELD_RULE, MONDAY_VALIDATOR]}
            >
              <DatePicker />
            </Form.Item>
          </>
        }
      />
    </Space>
  );
}
