import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthProvider';
import Layout from './layouts/Layout';
import CreateClassPage from './pages/create-assignment-page/CreateClassPage';
import HomePage from './pages/homepage/HomePage';
import LoginPage from './pages/login/LoginPage';
import RequireAuth from './pages/requireAuth/RequireAuth';
import UnauthorizedPage from './pages/unauthorized/UnauthorizedPage';
import CreateUser from './pages/user/CreateUser';
import ManageSubject from './pages/manage_subject/ManageSubject';
import EditUser from './pages/user/EditUser';
import reportWebVitals from './reportWebVitals';
import { ROLE } from './util/enum';
import UserPage from './pages/userpage/UserPage';
import AdminAssignList from './pages/assignment/ClassList';
import CreateSubject from './pages/asset/CreateSubject';
import EditClassPage from './pages/edit-class-page/EditClassPage';
import ManageSchedule from './pages/schedules/ManageSchedule';
import ManageAttend from './pages/attendace/ManageAttendance';

import EditSubject from './pages/asset/EditSubject';
import CreateSchedule from './pages/schedules/CreateSchedule';
import EditSchedule from './pages/schedules/EditSchedule';
import CheckAttendance from './pages/attendace/CheckAttendance';
import ManageMark from './pages/mark/ManageMark';
import ClassStudentsList from './pages/mark/ClassStudentsList'
import StudentMark from './pages/mark/StudentMarks';
import CreateMark from './pages/mark/CreateMark';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    {/* Same as */}
    <ToastContainer />
    <AuthProvider>
      <Routes>
        <Route path="/">
          <Route element={<RequireAuth allowedRoles={[ROLE.ADMIN, ROLE.STUDENT]}></RequireAuth>}>
            <Route
              index
              element={
                <Layout title="Trang chủ">
                  <HomePage />
                </Layout>
              }
            />
          </Route>

          <Route path="user">
            <Route element={<RequireAuth allowedRoles={[ROLE.ADMIN]}></RequireAuth>}>
              <Route
                index
                element={
                  <Layout title="Quản lý người dùng">
                    <UserPage />
                  </Layout>
                }
              />
              <Route
                path="create"
                element={
                  <Layout title="QL người dùng > Tạo mới">
                    <CreateUser />
                  </Layout>
                }
              />
              <Route
                path="edit/:username"
                element={
                  <Layout title="QL người dùng > Chỉnh sửa">
                    <EditUser />
                  </Layout>
                }
              />
            </Route>
          </Route>

          <Route path="subject">
            <Route
              index
              element={
                <Layout title="Quản lý môn học">
                  <ManageSubject />
                </Layout>
              }
            ></Route>
            <Route
              path="create"
              element={
                <Layout title="QL môn học > Tạo mới">
                  <CreateSubject />
                </Layout>
              }
            ></Route>
            <Route path="edit/:subjectid"
              element={
                <Layout title="QL môn học > Chỉnh sửa">
                  <EditSubject />
                </Layout>
              }></Route>
          </Route>
          <Route path="class">
            <Route element={<RequireAuth allowedRoles={[ROLE.ADMIN]}></RequireAuth>}>
              <Route
                index
                element={
                  <Layout title="Quản lý lớp học">
                    <AdminAssignList />
                  </Layout>
                }
              ></Route>
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}></RequireAuth>}>
              <Route
                path="create"
                element={
                  <Layout title="QL lớp học > Tạo mới">
                    <CreateClassPage />
                  </Layout>
                }
              ></Route>
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLE.ADMIN]}></RequireAuth>}>
              <Route
                path="edit/:classid"
                element={
                  <Layout title="QL lớp học > Chỉnh sửa">
                    <EditClassPage />
                  </Layout>
                }
              ></Route>
            </Route>
          </Route>
          <Route path="schedule">
            <Route
              index
              element={
                <Layout title="Quản lý thời khóa biểu">
                  <ManageSchedule />
                </Layout>
              }
            ></Route>

            <Route element={<RequireAuth allowedRoles={[ROLE.ADMIN, ROLE.MANAGER]}></RequireAuth>}>
              <Route
                path="create"
                element={
                  <Layout title="QL thời khóa biểu > Tạo mới">
                    <CreateSchedule />
                  </Layout>
                }
              ></Route>
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLE.ADMIN, ROLE.MANAGER]}></RequireAuth>}>
              <Route
                path="edit/:scheduleid"
                element={
                  <Layout title="QL thời khóa biểu > Chỉnh sửa">
                    <EditSchedule />
                  </Layout>
                }
              ></Route>
            </Route>
          </Route>
          
          <Route path="attendance">
            <Route
              index
              element={
                <Layout title="Quản lý điểm danh">
                  <ManageAttend />
                </Layout>
              }
            ></Route>

            <Route element={<RequireAuth allowedRoles={[ROLE.TEACHER]}></RequireAuth>}>
              <Route
                path="create"
                element={
                  <Layout title="QL điểm danh > Tạo mới">
                    <CreateSchedule />
                  </Layout>
                }
              ></Route>
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLE.TEACHER]}></RequireAuth>}>
              <Route
                path="check/:scheduleid"
                element={
                  <Layout title="QL điểm danh > điểm danh">
                    <CheckAttendance />
                  </Layout>
                }
              ></Route>
            </Route>
          </Route>

          <Route path="mark">
            <Route
              index
              element={
                <Layout title="Quản lý điểm HS">
                  <ManageMark />
                </Layout>
              }
            ></Route>

            <Route element={<RequireAuth allowedRoles={[ROLE.TEACHER]}></RequireAuth>}>
              <Route
                path="my-class/:id"
                element={
                  <Layout title="QL điểm HS > Tạo mới">
                    <ClassStudentsList />
                  </Layout>
                }
              ></Route>
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLE.TEACHER]}></RequireAuth>}>
              <Route
                path="my-class/:id/:code"
                element={
                  <Layout title="QL điểm HS > Điểm số">
                    <StudentMark />
                  </Layout>
                }
              ></Route>
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLE.TEACHER]}></RequireAuth>}>
              <Route
                path="my-class/:id/:code/create"
                element={
                  <Layout title="QL điểm HS > Tạo điểm">
                    <CreateMark />
                  </Layout>
                }
              ></Route>
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLE.TEACHER]}></RequireAuth>}>
              <Route
                path="my-class/edit/:markid"
                element={
                  <Layout title="QL điểm HS > chỉnh sửa">
                    <CheckAttendance />
                  </Layout>
                }
              ></Route>
            </Route>
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
