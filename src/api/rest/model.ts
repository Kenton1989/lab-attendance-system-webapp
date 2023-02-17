export type Role = {
  id?: number;
  name?: string;
};

export type User = {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  display_name?: string;
  roles?: Array<Role>;
  role_ids?: Array<number>;
  is_active?: boolean;
};

export type Week = {
  id?: number;
  name?: string;
  monday?: string;
  next_monday?: string;
  is_active?: boolean;
};

export type Lab = {
  id?: number;
  username?: string;
  display_name?: string;
  room_count?: number;
  executives?: Array<User>;
  executive_ids?: Array<number>;
  is_active?: boolean;
};

export type Course = {
  id?: number;
  code?: string;
  title?: string;
  is_active?: boolean;
  coordinators?: Array<User>;
  coordinator_ids?: Array<number>;
};

export type Group = {
  id?: number;
  course?: Course;
  course_id?: number;
  name?: string;
  lab?: Lab;
  lab_id?: number;
  room_no?: number;
  teachers?: Array<User>;
  teacher_ids?: Array<number>;
  supervisors?: Array<User>;
  supervisor_ids?: Array<number>;
  is_active?: boolean;
};

export type GroupStudent = {
  id?: number;
  student?: User;
  student_id?: number;
  group?: Group;
  group_id?: number;
  seat?: string;
};

export type Session = {
  id?: number;
  group?: Group;
  group_id?: number;
  start_datetime?: string;
  end_datetime?: string;
  week?: Week;
  is_compulsory?: boolean;
  allow_late_check_in?: boolean;
  check_in_deadline_mins?: number;
  is_active?: boolean;
};

export type StudentMakeUpSession = {
  id?: number;
  user?: User;
  user_id?: number;
  original_session?: Session;
  original_session_id?: number;
  make_up_session?: Session;
  make_up_session_id?: number;
};

type BaseAttendance = {
  id?: number;
  session?: Session;
  session_id?: number;
  attender?: User;
  attender_id?: number;
  check_in_state?: "attend" | "absent" | "late";
  check_in_datetime?: string;
  last_modify?: string;
  remark?: string;
  is_active?: boolean;
};

export type StudentAttendance = BaseAttendance;
export type TeacherAttendance = BaseAttendance;
export type Attendance = StudentAttendance | TeacherAttendance;

type AttendanceStatistics = {
  course?: Course;
  group?: Group;
  teacher?: User;
  attender?: User;

  overall_total_count?: number;
  overall_attend_count?: number;
  overall_late_count?: number;
  overall_absent_count?: number;
  overall_attend_rate?: number;
  overall_late_rate?: number;
  overall_absent_rate?: number;

  compulsory_total_count?: number;
  compulsory_attend_count?: number;
  compulsory_late_count?: number;
  compulsory_absent_count?: number;
  compulsory_attend_rate?: number;
  compulsory_late_rate?: number;
  compulsory_absent_rate?: number;

  non_compulsory_total_count?: number;
  non_compulsory_attend_count?: number;
  non_compulsory_late_count?: number;
  non_compulsory_absent_count?: number;
  non_compulsory_attend_rate?: number;
  non_compulsory_late_rate?: number;
  non_compulsory_absent_rate?: number;
};

export type StudentAttendanceStats = AttendanceStatistics;
export type TeacherAttendanceStats = AttendanceStatistics;

export type PreferenceSet = {
  session__earliest_check_in_minutes: number;
  server_email__address: string;
  server_email__password: string;
  server_email__smtp_server: string;
  // [k: string]: any;
};
