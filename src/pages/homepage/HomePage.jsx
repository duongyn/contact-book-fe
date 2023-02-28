import 'antd/dist/antd.less';
import Modal from 'antd/lib/modal/Modal';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { updatePasswordFirstTime } from '../../services';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import { validatePasswordHasVietnameseCharacter } from '../../util/validate';
import './homepage.css';

function HomePage() {
  let location = useLocation();

  // user login first time , but close the web , and reopen
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validate: values => {
      let errors = {};
      if (!values.password) {
        errors.password = 'Required !';
      } else if (values.password.trim().length === 0) {
        errors.password = 'Empty string !';
      } else if (values.password.length > 50) {
        errors.password = 'Too Long !';
      } else if (validatePasswordHasVietnameseCharacter(values.password)) {
        errors.password = 'Accented characters are not allowed';
      } else if (!/^[a-zA-Z0-9]/.test(values.password)) {
        errors.password = 'Special characters are not allowed';
      } else if (!values.password.match(/^\S*$/)) {
        errors.password = 'Spaces are not allowed';
      }
      return errors;
    },
    onSubmit: values => {
      changePasswordFirstTimeSubmit(values.password);
    },
  });

  const [inputPasswordType, setInputPasswordType] = useState('password');

  const navigate = useNavigate();

  const changePasswordFirstTimeSubmit = async newPassword => {
    const userWithNewPassword = {
      username: user.sub,
      password: newPassword,
    };
    let response = null;
    try {
      response = await updatePasswordFirstTime(userWithNewPassword);
    } catch (error) {
      showErrorMessage('Internal server error');
    }
    if (response.data) {
      showSuccessMessage('Your password has been changed successfully');
      navigate('/login', {
        state: {
          afterChangedPasswordFirstTimeToken: response.data.jwtToken,
        },
      });
    }
  };

  const changeInputPasswordType = () => {
    if (inputPasswordType === 'password') {
      setInputPasswordType('text');
    } else {
      setInputPasswordType('password');
    }
  };
  return (
    <>
    </>
  );
}

export default HomePage;
