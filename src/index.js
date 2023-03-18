import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthProvider';
import Layout from './layouts/Layout';
import CreateAssignmentPage from './pages/create-assignment-page/CreateAssignmentPage';
import HomePage from './pages/homepage/HomePage';
import LoginPage from './pages/login/LoginPage';
import RequireAuth from './pages/requireAuth/RequireAuth';
import UnauthorizedPage from './pages/unauthorized/UnauthorizedPage';
import CreateUser from './pages/user/CreateUser';
import ManageAsset from './pages/manage_asset/ManageSubject';
import EditUser from './pages/user/EditUser';
import reportWebVitals from './reportWebVitals';
import { ROLE } from './util/enum';
import UserPage from './pages/userpage/UserPage';
import AdminAssignList from './pages/assignment/AdminAssignList';
import CreateAsset from './pages/asset/CreateAsset';
import EditAssignmentPage from './pages/edit-assignment-page/EditAssignmentPage';

import ViewReturningRequest from './pages/view_returning_request/ViewReturningRequest';
import EditSubject from './pages/asset/EditSubject';
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
            <Route element={<RequireAuth allowedRoles={[ROLE.ADMIN, ROLE.STUDENT]}></RequireAuth>}>
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
                  <ManageAsset />
                </Layout>
              }
            ></Route>
            <Route
              path="create"
              element={
                <Layout title="QL môn học > Tạo mới">
                  <CreateAsset />
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
                    <CreateAssignmentPage />
                  </Layout>
                }
              ></Route>
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLE.ADMIN]}></RequireAuth>}>
              <Route
                path="edit"
                element={
                  <Layout title="QL lớp học > Chỉnh sửa">
                    <EditAssignmentPage />
                  </Layout>
                }
              ></Route>
            </Route>
          </Route>
          <Route path="RequestForReturning">
            <Route
              index
              element={
                <Layout title="Quản lý thời khóa biểu">
                  <ViewReturningRequest />
                </Layout>
              }
            ></Route>
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
