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
import { CourseList } from "./components/course";

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
          <Route path="" element={<RootPage />}>
            <Route index element={<Navigate to="/home" />} />
            <Route path="home" element={<Home />} />
            <Route path="users">
              <Route index element={<DummyComponent />} />
              <Route path=":userId" element={<DummyComponent />} />
            </Route>
            <Route path="courses">
              <Route index element={<CourseList />} />
              <Route path=":courseId" element={<DummyComponent />} />
            </Route>
            <Route path="groups">
              <Route index element={<DummyComponent />} />
              <Route path=":groupId" element={<DummyComponent />} />
            </Route>
            <Route path="sessions">
              <Route index element={<DummyComponent />} />
              <Route path=":sessionId" element={<DummyComponent />} />
            </Route>
            <Route path="labs" element={<DummyComponent />} />
            <Route path="weeks" element={<DummyComponent />} />
            <Route path="attendance-statistics">
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
            <Route path="my-student-attendances" element={<DummyComponent />} />
            <Route path="my-teacher-attendances" element={<DummyComponent />} />
            <Route path="student-attendances" element={<DummyComponent />} />
            <Route path="teacher-attendances" element={<DummyComponent />} />
            <Route path="preferences" element={<DummyComponent />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="404" element={<NotFount404 />} />
          <Route path="500" element={<InternalServerError500 />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
