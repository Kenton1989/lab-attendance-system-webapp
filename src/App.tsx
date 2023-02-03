import React from "react";
import "./App.css";
import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
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
import { LabDetail, LabList } from "./components/lab";
import { GroupDetail, GroupList } from "./components/group";
import { SessionDetail, SessionList } from "./components/session";
import { WeekDetail, WeekList } from "./components/week";
import {
  MyStudentAttendance,
  MyTeacherAttendance,
  StudentAttendance,
  TeacherAttendance,
} from "./components/attendance";

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
              <Route path=":userId" element={<UserDetail />} />
            </Route>
            <Route path="courses">
              <Route index element={<CourseList />} />
              <Route path=":courseId" element={<CourseDetail />} />
            </Route>
            <Route path="groups">
              <Route index element={<GroupList />} />
              <Route path=":groupId" element={<GroupDetail />} />
            </Route>
            <Route path="sessions">
              <Route index element={<SessionList />} />
              <Route path=":sessionId" element={<SessionDetail />} />
            </Route>
            <Route path="labs">
              <Route index element={<LabList />} />
              <Route path=":labId" element={<LabDetail />} />
            </Route>
            <Route path="weeks">
              <Route index element={<WeekList />} />
              <Route path=":weekId" element={<WeekDetail />} />
            </Route>
            <Route path="student-attendances">
              <Route index element={<StudentAttendance />} />
              <Route path=":attendanceId" element={<DummyComponent />} />
            </Route>
            <Route path="teacher-attendances">
              <Route index element={<TeacherAttendance />} />
              <Route path=":attendanceId" element={<DummyComponent />} />
            </Route>
            <Route
              path="my-student-attendances"
              element={<MyStudentAttendance />}
            />
            <Route
              path="my-teacher-attendances"
              element={<MyTeacherAttendance />}
            />
            <Route path="preferences" element={<DummyComponent />} />
            <Route path="attendance-statistics">
              <Route index element={<DummyComponent />} />
              <Route path="courses" element={<DummyComponent />}>
                <Route
                  index
                  element={<Empty description="Please select a course." />}
                />
                <Route path=":courseId" element={<DummyComponent />} />
              </Route>
              <Route path="groups" element={<DummyComponent />}>
                <Route
                  index
                  element={<Empty description="Please select a course." />}
                />
                <Route path=":courseId">
                  <Route
                    index
                    element={<Empty description="Please select a group." />}
                  />
                  <Route path=":groupId" element={<DummyComponent />} />
                </Route>
              </Route>
              <Route path="teachers" element={<DummyComponent />}>
                <Route
                  index
                  element={<Empty description="Please select a TA." />}
                />
                <Route path=":userId" element={<DummyComponent />} />
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
