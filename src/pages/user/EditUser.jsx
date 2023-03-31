import { validateDate, validateJoinedDate, validateType } from './validation/validation';
import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../../services/userService';
import './create-user.css';
import useAuth from '../../hooks/useAuth';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';

const EditUser = () => {
  const currentUser = useAuth().user.sub;

  const initialUserState = {
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    roleName: '',
    updatedBy: currentUser,
  };

  let navigate = useNavigate();
  const [newUser, setNewUser] = useState(initialUserState);
  const params = useParams();
  const username = params.username;

  useEffect(() => {
    if (username) {
      UserService.getByUsername(username)
        .then(response => {
          setNewUser(response.data);
        })
        .catch(e => {
          showErrorMessage('Error: ' + e.response.data);
          setTimeout(() => {
            navigate('/user');
          }, 3000);
          console.error(e.response.data);
        });
    }
  }, [username]);

  const [touched, setTouched] = useState({
    dob: false,
    joinedDate: false,
    roleName: false,
  });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value, updatedBy: currentUser });
  };

  const handleBlur = evt => {
    setTouched({
      ...touched,
      [evt.target.name]: true,
    });
  };

  const editUser = e => {
    e.preventDefault();
    const editUser = {
      userCode: newUser.userCode,
      editField: 'information',
      userFName: newUser.firstName,
      userLName: newUser.lastName,
      userAddress: newUser.address,
      roleName: [newUser.roleName],
      dob: newUser.dob,
      gender: newUser.gender
    }
    UserService.edit(editUser)
      .then(response => {
        showSuccessMessage(`Edit user success!`);
        setTimeout(() => {
          navigate('/user', { state: { editUser: response.data, prePath: '/user/edit' } });
        }, 2000);
      })
      .catch(e => {
        showErrorMessage('Error: ' + e.response.data);
        console.error(e);
      });
  };

  const errorDob = validateDate(newUser.dob);
  const errorType = validateType(newUser.roleName);

  const formValid = !errorDob && !errorType;

  const onCancel = () => {
    setNewUser(initialUserState);
    navigate('/user');
  };

  return (
    <div className="container mt-5" style={{ marginLeft: '180px', width: '500px' }}>
      <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>Chỉnh sửa người dùng</h1>
      <Form onSubmit={editUser} validated={false}>
        <Form.Group className="mb-3">
          <Form.Label> Tên </Form.Label>
          <Form.Control disabled name="firstName" value={newUser.firstName} type="text" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Họ</Form.Label>
          <Form.Control disabled name="lastName" value={newUser.lastName} type="text" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Ngày sinh</Form.Label>
          <Form.Control
            name="dob"
            value={newUser.dob}
            onChange={handleInputChange}
            onBlur={handleBlur}
            type="date"
            min={new Date('1900/01/02').toISOString().split('T')[0]}
            max={new Date().toISOString().split('T')[0]}
            isInvalid={touched.dob && Boolean(errorDob)}
            isValid={touched.dob && !Boolean(errorDob)}
          />
          <Form.Control.Feedback type="invalid">{errorDob}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Giới tính</Form.Label>
          {(newUser.gender == 'Male' && (
            <Form.Check className="ml-5" type="radio" id="inline-radio-1" inline>
              <Form.Check.Input
                type="radio"
                defaultChecked
                name="gender"
                value="Male"
                onClick={handleInputChange}
              />
              <Form.Check.Label style={{ paddingTop: 0 }}>Nam</Form.Check.Label>
            </Form.Check>
          )) || (
            <Form.Check className="ml-5" type="radio" id="inline-radio-1" inline>
              <Form.Check.Input
                type="radio"
                name="gender"
                value="Male"
                onClick={handleInputChange}
              />
              <Form.Check.Label style={{ paddingTop: 0 }}>Nam</Form.Check.Label>
            </Form.Check>
          )}

          {(newUser.gender == 'Female' && (
            <Form.Check className="ml-5" type="radio" id="inline-radio-2" inline>
              <Form.Check.Input
                type="radio"
                defaultChecked
                name="gender"
                value="Female"
                onClick={handleInputChange}
              />
              <Form.Check.Label style={{ paddingTop: 0 }}>Nữ</Form.Check.Label>
            </Form.Check>
          )) || (
            <Form.Check className="ml-5" type="radio" id="inline-radio-2" inline>
              <Form.Check.Input
                type="radio"
                name="gender"
                value="Female"
                onClick={handleInputChange}
              />
              <Form.Check.Label style={{ paddingTop: 0 }}>Nữ</Form.Check.Label>
            </Form.Check>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="mr-5">Vai trò</Form.Label>
          <Form.Select
            size="lg"
            aria-label=""
            name="type"
            style={{ width: '150px' }}
            onChange={handleInputChange}
            isInvalid={touched.type && Boolean(errorType)}
            isValid={touched.type && !Boolean(errorType)}
            onBlur={handleBlur}
          >
            {(newUser.roleName[0] == 'ADMIN' && (
              <option value="ADMIN" selected>
                Admin
              </option>
            )) || <option value="ADMIN">Admin</option>}
            {(newUser.roleName[0] == 'TEACHER' && (
              <option value="TEACHER" selected>
                Teacher
              </option>
            )) || <option value="TEACHER">Teacher</option>}
            {(newUser.roleName[0] == 'MANAGER' && (
              <option value="MANAGER" selected>
                Manager
              </option>
            )) || <option value="MANAGER">Manager</option>}
            {(newUser.roleName[0] == 'STUDENT' && (
              <option value="STUDENT" selected>
                Student
              </option>
            )) || <option value="STUDENT">Student</option>}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errorType}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>
        <Button
          style={{ marginLeft: '240px' }}
          disabled={!formValid}
          variant="danger"
          type="submit"
        >
          Lưu
        </Button>
        <Button
          style={{ float: 'right', marginRight: '80px' }}
          variant="light"
          onClick={onCancel}
          className="btn btn-outline-secondary"
          type="button"
        >
          Hủy bỏ
        </Button>
      </Form>
    </div>
  );
};

export default EditUser;
