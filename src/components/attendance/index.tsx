import { Form, Select } from "antd";
import { LabeledValue } from "antd/es/select";
import { useState } from "react";
import api, { Course, Group, SimpleRestApi, UrlParamSet } from "../../api";
import {
  CourseSelect,
  GroupSelect,
  UserSelect,
  WeekSelect,
} from "../form-select-item";
import { BaseAttendancePage } from "./base";

export { BaseAttendancePage } from "./base";

const NO_ROLE: string[] = [];
const ADMIN_ROLE = ["admin"];
const STAFF_ROLE = ["staff", "admin"];
const STUDENT_ROLE = ["student", "admin"];
const TEACHER_ROLE = ["teacher", "admin"];

const CHECK_IN_STATE_OPTIONS: LabeledValue[] = [
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

function AttendanceFilterItems() {
  const [groupParams, setGroupParams] = useState<UrlParamSet<Group>>({});

  return (
    <>
      <Form.Item label="Attender" name="attender">
        <UserSelect />
      </Form.Item>
      <Form.Item label="Course" name="course">
        <CourseSelect onChange={(id) => setGroupParams({ course: id })} />
      </Form.Item>
      <Form.Item label="Group" name="group">
        <GroupSelect additionalListUrlParams={groupParams} />
      </Form.Item>
      <Form.Item label="Session Week" name="session_week">
        <WeekSelect />
      </Form.Item>
      <Form.Item label="State" name="check_in_state">
        <Select options={CHECK_IN_STATE_OPTIONS} style={{ minWidth: "8em" }} />
      </Form.Item>
    </>
  );
}

export function StudentAttendance(props: {}) {
  return (
    <BaseAttendancePage
      title="student attendance"
      readableRoles={STAFF_ROLE}
      creatableRoles={ADMIN_ROLE}
      api={api.student_attendance}
      formatItemPath={({ id }) => `/student-attendances/${id}`}
      filterFormItems={<AttendanceFilterItems />}
    />
  );
}

export function TeacherAttendance(props: {}) {
  return (
    <BaseAttendancePage
      title="TA attendance"
      readableRoles={STAFF_ROLE}
      creatableRoles={ADMIN_ROLE}
      api={api.teacher_attendance}
      formatItemPath={({ id }) => `/teacher-attendances/${id}`}
      filterFormItems={<AttendanceFilterItems />}
    />
  );
}

function MyAttendanceFilterItems(props: {
  courseOptionsApi: SimpleRestApi<Course>;
}) {
  return (
    <>
      <Form.Item label="Course" name="course">
        <CourseSelect api={props.courseOptionsApi} />
      </Form.Item>
      <Form.Item label="Session Week" name="session_week">
        <WeekSelect />
      </Form.Item>
      <Form.Item label="State" name="check_in_state">
        <Select options={CHECK_IN_STATE_OPTIONS} style={{ minWidth: "8em" }} />
      </Form.Item>
    </>
  );
}

export function MyStudentAttendance(props: {}) {
  return (
    <BaseAttendancePage
      title="my attendance"
      readableRoles={STUDENT_ROLE}
      creatableRoles={NO_ROLE}
      api={api.my_student_attendance}
      formatItemPath={({ id }) => `/student-attendances/${id}`}
      hideTableHeader
      filterFormItems={
        <MyAttendanceFilterItems
          courseOptionsApi={api.my_student_attendance_course_options}
        />
      }
    />
  );
}

export function MyTeacherAttendance(props: {}) {
  return (
    <BaseAttendancePage
      title="my attendance"
      readableRoles={TEACHER_ROLE}
      creatableRoles={NO_ROLE}
      api={api.my_teacher_attendance}
      formatItemPath={({ id }) => `/teacher-attendances/${id}`}
      hideTableHeader
      filterFormItems={
        <MyAttendanceFilterItems
          courseOptionsApi={api.my_teacher_attendance_course_options}
        />
      }
    />
  );
}
