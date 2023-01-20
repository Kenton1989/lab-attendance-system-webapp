import React from 'react';
import './App.css';
import {
  Navigate, Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import RootPage from './components/root';
import Login from './components/login';
import NotFount404 from './components/not-found';
import DummyComponent from './components/dummy';
import { Empty } from "antd";

function App() {
  return <PageRouter />
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootPage />}>
        <Route index element={<Navigate to="/home" />} />
        <Route path="home" element={<DummyComponent />} />
        <Route path="users">
          <Route index element={<DummyComponent />} />
          <Route path=":userId" element={<DummyComponent />} />
        </Route>
        <Route path="courses">
          <Route index element={<DummyComponent />} />
          <Route path=":courseId">
            <Route index element={<DummyComponent />} />
            <Route path=":groupId" element={<DummyComponent />} />
          </Route>
        </Route>
        <Route path="labs" element={<DummyComponent />} />
        <Route path="weeks" element={<DummyComponent />} />
        <Route path="statistics">
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
          <Route path="teaching-assistants" element={<DummyComponent />}>
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
        <Route path="config" element={<DummyComponent />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="404" element={<NotFount404 />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </>
  )
);

function PageRouter(): JSX.Element {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
