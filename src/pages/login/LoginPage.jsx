import 'antd/dist/antd.min.css';
import { Formik } from 'formik';
import jwt from 'jwt-decode';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth';
import { authenticate } from '../../services';
import { showErrorMessage } from '../../util/toastdisplay';
import './login.css';

function LoginPage() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      if (location.state.afterChangedPasswordFirstTimeToken) {
        setToken(location.state.afterChangedPasswordFirstTimeToken);
        localStorage.setItem('token', location.state.afterChangedPasswordFirstTimeToken);
        const decodedUser = jwt(location.state.afterChangedPasswordFirstTimeToken);
        navigate('/', {
          state: {
            firstTimeLogin: decodedUser.firstTimeLogin,
          },
        });
      }
    }
  });

  const onFinish = async user => {
    try {
      const response = await authenticate(user);
      setToken(response.data.jwtToken);
      localStorage.setItem('token', response.data.jwtToken);
      const decodedUser = jwt(response.data.jwtToken);
      localStorage.removeItem('userLocation');
      localStorage.setItem('userLocation', decodedUser.adminLocation);
      navigate('/');
    } catch (error) {
      if (error.response.data.message) {
        console.error(error);
        showErrorMessage(error.response.data.message);
      }
      else{
        showErrorMessage('Username or password is incorrect. Please try again');
      }
    }
  };

  return (
    <section className="login-page">
      <h1>Login</h1>

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={Yup.object({
          username: Yup.string().required('Please enter username'),
          password: Yup.string().required('Please enter password'),
        })}
        onSubmit={values => {
          let user = {
            username: values.username,
            password: values.password,
          };
          onFinish(user);
        }}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
          } = props;
          return (
            <form onSubmit={handleSubmit} className="login-form-custom">
              <div className="mb-3">
                <input
                  id="username"
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="large"
                  placeholder="Username"
                  maxLength={50}
                  className={
                    errors.username && touched.username
                      ? 'text-input error form-control'
                      : 'text-input form-control'
                  }
                />
                {errors.username && touched.username && (
                  <div className="input-feedback">{errors.username}</div>
                )}
              </div>
              <div className="mb-3">
                <input
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="large"
                  type="password"
                  placeholder="Password"
                  maxLength={50}
                  className={
                    errors.password && touched.password
                      ? 'text-input error form-control'
                      : 'text-input form-control'
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </div>

              <div className="center-button">
                <button
                  disabled={errors.username || errors.password}
                  type="submit"
                  className="btn btn-primary"
                >
                  Log in
                </button>
              </div>
            </form>
          );
        }}
      </Formik>
    </section>
  );
}

export default LoginPage;
