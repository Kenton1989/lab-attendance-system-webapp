import dayjs, { Dayjs } from "dayjs";

export function makeDateFieldsTransformer<T>(...fields: (keyof T)[]): {
  formToData: (val: any) => T;
  dataToForm: (data: T) => any;
} {
  const formToData = (val: any) => {
    let dateTimes: any = {};

    for (const field of fields) {
      const dateTimeObj: Dayjs | undefined = val[field];
      if (dayjs.isDayjs(dateTimeObj)) {
        dateTimes[field] = dateTimeObj.format("YYYY-MM-DD");
      }
    }

    return { ...val, ...dateTimes } as T;
  };

  const dataToForm = (data: T) => {
    let dateTimes: any = {};

    for (const field of fields) {
      const dateTimeStr = data[field];
      if (dateTimeStr && typeof dateTimeStr === "string") {
        dateTimes[field] = dayjs(dateTimeStr);
      }
    }

    return { ...data, ...dateTimes };
  };

  return {
    formToData,
    dataToForm,
  };
}
