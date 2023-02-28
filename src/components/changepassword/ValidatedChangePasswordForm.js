import React from 'react';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import './ChangePassword.css';
import { validatePassword } from '../../util/validate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { changePassword, checkPassword } from '../../services/index';
import useAuth from '../../hooks/useAuth';

function ValidatedChangePasswordForm(props) {
  const { user } = useAuth();

  let username = user.sub;

  const [values, setValues] = useState({
    username: username,
    oldPassword: '',
    newPassword: '',
  });

  const [revealOldPassword, setRevealOldPassword] = useState(false);
  const [revealNewPassword, setRevealNewPassword] = useState(false);
  const [oldPasswordErrorMessages, setOldPasswordErrorMessages] = useState('');
  const [newPasswordErrorMessages, setNewPasswordErrorMessages] = useState('');

  const [touched, setTouched] = useState({
    oldPassword: false,
    newPassword: false,
  });

  const handleSubmit = async evt => {
    evt.preventDefault();
    if (validatePassword(values.oldPassword) == '' && validatePassword(values.newPassword) == '') {
      const response = await changePassword(values);
      props.setIsSubmitted(true);
    }
  };

  const handleChange = evt => {
    setValues({
      ...values,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleClose = () => {
    props.setShow(false);
    props.setIsSubmitted(false);
    setValues({
      ...values,
      oldPassword: '',
      newPassword: '',
    });
    setTouched(false, false);
    setOldPasswordErrorMessages('');
    setNewPasswordErrorMessages('');
  };

  const handleBlur = async evt => {
    setTouched({
      ...touched,
      [evt.target.name]: true,
    });

    if (values.oldPassword !== '') {
      const response = await checkPassword(values);
      setOldPasswordErrorMessages(response.data);
    }

    setNewPasswordErrorMessages(validatePassword(values.newPassword));
  };

  const formValid =
    oldPasswordErrorMessages == '' &&
    newPasswordErrorMessages == '' &&
    values.newPassword != '' &&
    values.oldPassword != '';

  return (
    <Formik
      validate={values => {
        let errors = {};
        errors.oldPassword = validatePassword(values.oldPassword);
        errors.newPassword = validatePassword(values.newPassword);

        return errors;
      }}
      initialValues={{ oldPassword: '', newPassword: '' }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(false);
        }, 500);
      }}
    >
      {() => {
        return (
          <form onSubmit={handleSubmit}>
            <div className="grid-container">
              <label htmlFor="oldPassword" className="grid-item">
                Old password
              </label>
              <div className="grid-item">
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type={`${revealOldPassword ? 'text' : 'password'}`}
                  placeholder="Enter your old password"
                  value={values.oldPassword}
                  maxLength="50"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={oldPasswordErrorMessages && touched.oldPassword && 'error'}
                />
                {oldPasswordErrorMessages && touched.oldPassword && (
                  <div className="input-feedback_changepassword">{oldPasswordErrorMessages}</div>
                )}
                <div className="wrapper">
                  <div className="icon">
                    {!revealOldPassword ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        className="cursor-pointer absolute text-gray-500"
                        onClick={() => setRevealOldPassword(true)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        className="cursor-pointer absolute text-gray-500"
                        onClick={() => setRevealOldPassword(false)}
                      />
                    )}
                  </div>
                </div>
              </div>

              <label htmlFor="newPassword" className="grid-item">
                New Password
              </label>
              <div className="grid-item">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={`${revealNewPassword ? 'text' : 'password'}`}
                  placeholder="Enter your new password"
                  value={values.newPassword}
                  maxLength="50"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={newPasswordErrorMessages && touched.newPassword && 'error'}
                />
                {newPasswordErrorMessages && touched.newPassword && (
                  <div className="input-feedback_changepassword">{newPasswordErrorMessages}</div>
                )}
                <div className="wrapper">
                  <div className="icon">
                    {!revealNewPassword ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        className="cursor-pointer absolute text-gray-500"
                        onClick={() => setRevealNewPassword(true)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        className="cursor-pointer absolute text-gray-500"
                        onClick={() => setRevealNewPassword(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex flex-row-reverse" style={{ paddingTop: '40px' }}>
              <Button variant="" style={{ marginLeft: '20px' }} onClick={handleClose}>
                Cancel
              </Button>
              <Button
                disabled={!formValid}
                className="d-flex text-light bg-danger shadow-none border border-danger"
                type="submit"
                value="Submit"
              >
                Save
              </Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
}

export default ValidatedChangePasswordForm;
