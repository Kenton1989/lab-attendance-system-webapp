import { Form, Select } from "antd";
import { useState } from "react";
import api, { Course, Group, SimpleRestApi, UrlParamSet } from "../../api";
import { CHECK_IN_STATE_OPTIONS } from "../form";
import { CourseSelect, GroupSelect, UserSelect, WeekSelect } from "../form";
import { BaseAttendanceListPage } from "./base";

export { BaseAttendanceListPage as BaseAttendancePage } from "./base";

const NO_ROLE: string[] = [];
const ADMIN_ROLE = ["admin"];
const STAFF_ROLE = ["staff", "admin"];
const STUDENT_ROLE = ["student", "admin"];
const TEACHER_ROLE = ["teacher", "admin"];

function AttendanceFilterItems(props: { role: string }) {
  const [groupParams, setGroupParams] = useState<UrlParamSet<Group>>({});

  return (
    <>
      <Form.Item label="Attender" name="attender">
        <UserSelect role={props.role} />
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
        <Select
          options={CHECK_IN_STATE_OPTIONS}
          allowClear
          style={{ minWidth: "8em" }}
        />
      </Form.Item>
    </>
  );
}

export function StudentAttendanceList(props: {}) {
  return (
    <BaseAttendanceListPage
      title="student attendance"
      readableRoles={STAFF_ROLE}
      creatableRoles={ADMIN_ROLE}
      api={api.student_attendance}
      formatItemPath={({ id }) => `/student_attendances/${id}`}
      filterFormItems={<AttendanceFilterItems role="student" />}
    />
  );
}

export function TeacherAttendanceList(props: {}) {
  return (
    <BaseAttendanceListPage
      title="TA attendance"
      readableRoles={STAFF_ROLE}
      creatableRoles={ADMIN_ROLE}
      api={api.teacher_attendance}
      formatItemPath={({ id }) => `/teacher_attendances/${id}`}
      filterFormItems={<AttendanceFilterItems role="teacher" />}
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
        <Select
          options={CHECK_IN_STATE_OPTIONS}
          allowClear
          style={{ minWidth: "8em" }}
        />
      </Form.Item>
    </>
  );
}

export function MyStudentAttendanceList(props: {}) {
  return (
    <BaseAttendanceListPage
      title="my attendance"
      readableRoles={STUDENT_ROLE}
      creatableRoles={NO_ROLE}
      api={api.my_student_attendance}
      formatItemPath={({ id }) => `/student_attendances/${id}`}
      hideTableHeader
      filterFormItems={
        <MyAttendanceFilterItems
          courseOptionsApi={api.my_student_attendance_course_options}
        />
      }
    />
  );
}

export function MyTeacherAttendanceList(props: {}) {
  return (
    <BaseAttendanceListPage
      title="my attendance"
      readableRoles={TEACHER_ROLE}
      creatableRoles={NO_ROLE}
      api={api.my_teacher_attendance}
      formatItemPath={({ id }) => `/teacher_attendances/${id}`}
      hideTableHeader
      filterFormItems={
        <MyAttendanceFilterItems
          courseOptionsApi={api.my_teacher_attendance_course_options}
        />
      }
    />
  );
}
