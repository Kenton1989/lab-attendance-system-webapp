import React from "react";
import "./App.css";
import {
  Navigate,
  Route,
  BrowserRouter,
  Routes,
  Outlet,
} from "react-router-dom";
import RootPage from "./components/root";
import Login from "./components/login";
import NotFount404 from "./components/not-found";
import DummyComponent from "./components/dummy";
import { Empty } from "antd";
import { AuthProvider } from "./components/auth-context";
import { Home } from "./components/home";
import InternalServerError500 from "./components/internal-server-error";
import { ErrorBoundary } from "./components/error-boundary";
import { DEFAULT_LOGIN_PATH } from "./components/const";
import { CourseDetail, CourseList } from "./components/course";
import { UserDetail, UserList } from "./components/user";
import { CreateLab, LabDetail, LabList } from "./components/lab";
import { GroupDetail, GroupList } from "./components/group";
import { SessionDetail, SessionList } from "./components/session";
import { WeekDetail, WeekList } from "./components/week";
import {
  MyStudentAttendanceList,
  MyTeacherAttendanceList,
  StudentAttendanceList,
  TeacherAttendanceList,
} from "./components/attendance";
import { ChangePassword } from "./components/user/password";
import { GroupStudentDetail } from "./components/group/group-student";
import {
  StudentAttendanceDetail,
  TeacherAttendanceDetail,
} from "./components/attendance/detail";
import { CreateCourse } from "./components/course/create";
import { CreateUser } from "./components/user/create";
import { CreateGroup } from "./components/group/create";
import { Settings } from "./components/settings";
import {
  CourseStatistics,
  CourseStatisticsDetail,
  GroupStatistics,
  GroupStatisticsDetail,
  StatisticsRoot,
  StudentStatistics,
  StudentStatisticsDetail,
  TeacherStatistics,
  TeacherStatisticsDetail,
} from "./components/statistics";

function App() {
  return (
    <ErrorBoundary>
      <PageRouter />
    </ErrorBoundary>
  );
}

function PageRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <AuthProvider loginPagePath={DEFAULT_LOGIN_PATH}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="404" element={<NotFount404 />} />
          <Route path="500" element={<InternalServerError500 />} />
          <Route path="" element={<RootPage />}>
            <Route index element={<Navigate to="/home" />} />
            <Route path="home" element={<Home />} />
            <Route path="users">
              <Route index element={<UserList />} />
              <Route path="new" element={<CreateUser />} />
              <Route path=":userId">
                <Route index element={<UserDetail />} />
                <Route path="password" element={<ChangePassword />} />
              </Route>
            </Route>
            <Route path="courses">
              <Route index element={<CourseList />} />
              <Route path="new" element={<CreateCourse />} />
              <Route path=":courseId" element={<CourseDetail />} />
            </Route>
            <Route path="groups">
              <Route index element={<GroupList />} />
              <Route path="new" element={<CreateGroup />} />
              <Route path=":groupId" element={<GroupDetail />} />
            </Route>
            <Route
              path="group_students/:groupStudentId"
              element={<GroupStudentDetail />}
            />
            <Route path="sessions">
              <Route index element={<SessionList />} />
              <Route path=":sessionId" element={<SessionDetail />} />
            </Route>
            <Route path="labs">
              <Route index element={<LabList />} />
              <Route path="new" element={<CreateLab />} />
              <Route path=":labId" element={<LabDetail />} />
            </Route>
            <Route path="weeks">
              <Route index element={<WeekList />} />
              <Route path=":weekId" element={<WeekDetail />} />
            </Route>
            <Route path="student_attendances">
              <Route index element={<StudentAttendanceList />} />
              <Route
                path=":attendanceId"
                element={<StudentAttendanceDetail />}
              />
            </Route>
            <Route path="teacher_attendances">
              <Route index element={<TeacherAttendanceList />} />
              <Route
                path=":attendanceId"
                element={<TeacherAttendanceDetail />}
              />
            </Route>
            <Route
              path="my_student_attendances"
              element={<MyStudentAttendanceList />}
            />
            <Route
              path="my_teacher_attendances"
              element={<MyTeacherAttendanceList />}
            />
            <Route path="settings" element={<Settings />} />
            <Route path="attendance_statistics" element={<StatisticsRoot />}>
              <Route
                index
                element={<Empty description="Please select data type." />}
              />
              <Route path="courses" element={<CourseStatistics />}>
                <Route
                  index
                  element={<Empty description="Please select a course." />}
                />
                <Route path=":courseId" element={<CourseStatisticsDetail />} />
              </Route>
              <Route path="groups" element={<GroupStatistics />}>
                <Route
                  index
                  element={<Empty description="Please select a group." />}
                />
                <Route path=":groupId" element={<GroupStatisticsDetail />} />
              </Route>
              <Route path="teachers" element={<TeacherStatistics />}>
                <Route
                  index
                  element={<Empty description="Please select a TA." />}
                />
                <Route path=":userId" element={<TeacherStatisticsDetail />} />
              </Route>
              <Route path="students" element={<StudentStatistics />}>
                <Route
                  index
                  element={<Empty description="Please select a Student." />}
                />
                <Route path=":userId" element={<StudentStatisticsDetail />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
