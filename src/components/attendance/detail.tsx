import api from "../../api";
import { BaseAttendanceDetailPage } from "./base";

export function StudentAttendanceDetail(props: {}) {
  return <BaseAttendanceDetailPage api={api.student_attendance} />;
}

export function TeacherAttendanceDetail(props: {}) {
  return (
    <BaseAttendanceDetailPage
      api={api.teacher_attendance}
      titlePrefix={["TA attendance"]}
    />
  );
}
