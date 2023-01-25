import { Session } from "inspector";
import SimpleRestApi, { PreferenceApi } from "./operations";
import {
  Course,
  Group,
  GroupStudent,
  Lab,
  Role,
  StudentAttendance,
  StudentMakeUpSession,
  TeacherAttendance,
  User,
  Week,
} from "./model";

export * from "./model";

export class Api {
  week = new SimpleRestApi<Week>("/weeks");
  role = new SimpleRestApi<Role>("/roles");
  user = new SimpleRestApi<User, number | "me">("/users");
  my_role = new SimpleRestApi<Role>("/users/me/roles");
  my_managed_course = new SimpleRestApi<Course>("/users/me/managed_courses");
  my_managed_group = new SimpleRestApi<Group>("/users/me/managed_groups");
  my_managed_lab = new SimpleRestApi<Lab>("/users/me/managed_labs");
  my_student_attendance = new SimpleRestApi<StudentAttendance>(
    "/users/me/student_attendances"
  );
  my_teacher_attendance = new SimpleRestApi<TeacherAttendance>(
    "/users/me/teacher_attendances"
  );
  my_student_attendance_course_options = new SimpleRestApi<Course>(
    "/users/me/student_attendance/course_options"
  );
  my_teacher_attendance_course_options = new SimpleRestApi<Course>(
    "/users/me/teacher_attendance/course_options"
  );
  lab = new SimpleRestApi<Lab>("/lab");
  group = new SimpleRestApi<Group>("/group");
  group_student = new SimpleRestApi<GroupStudent>("/group_student");
  session = new SimpleRestApi<Session>("/session");
  student_make_up_session = new SimpleRestApi<StudentMakeUpSession>(
    "/student_make_up_session"
  );
  student_attendance = new SimpleRestApi<StudentAttendance>(
    "/student_attendance"
  );
  teacher_attendance = new SimpleRestApi<StudentAttendance>(
    "/teacher_attendance"
  );
  student_attendance_stats = new SimpleRestApi<any>(
    "/student_attendances/statistics"
  );
  teacher_attendance_stats = new SimpleRestApi<any>(
    "/teacher_attendances/statistics"
  );
  preference = new PreferenceApi();
}

const api = new Api();

export default api;
