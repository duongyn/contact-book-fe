import {
  validateDate,
  validateFirstName,
  validateJoinedDate,
  validateLastName,
  validateType,
} from './validation/validation';
import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/userService';
import './create-user.css';
import useAuth from '../../hooks/useAuth';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';

const CreateUser = () => {
  const initialUserState = {
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Female',
    joinedDate: '',
    location: 'Hanoi',
    role: '',
    createdBy: '',
  };

  const currentUser = useAuth().user.sub;

  let navigate = useNavigate();

  const [newUser, setNewUser] = useState(initialUserState);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    dob: false,
    joinedDate: false,
    role: false,
  });

  useEffect(() => {
    if (localStorage.getItem('userLocation')) {
      setNewUser({
        ...newUser,
        location: localStorage.getItem('userLocation'),
        createdBy: currentUser,
      });
    }
  }, []);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleBlur = evt => {
    setTouched({
      ...touched,
      [evt.target.name]: true,
    });
    if (evt.target.name === 'firstName') {
      newUser.firstName = newUser.firstName.trim();
    }
    if (evt.target.name === 'lastName') {
      newUser.lastName = newUser.lastName.trim();
    }
  };

  const createUser = e => {
    e.preventDefault();
    let user = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      dob: newUser.dob,
      gender: newUser.gender,
      address: newUser.address,
      roleName: [newUser.role],
      joinedDate: null,
      createdBy: newUser.createdBy,

    }
    UserService.create(user)
      .then(response => {
        showSuccessMessage(`Create user success!`);
        setTimeout(() => {
          navigate('/user', { state: { createdUser: response.data, prePath: '/user/create' } });
        }, 2000);
      })
      .catch(e => {
        showErrorMessage('Error: ' + e.response.data);
        console.error(e);
      });
  };

  const errorFirstName = validateFirstName(newUser.firstName);
  const errorLastName = validateLastName(newUser.lastName);
  const errorDob = validateDate(newUser.dob);
  const errorType = validateType(newUser.role);

  const formValid =
    !errorFirstName && !errorLastName && !errorDob && !errorType;

  const onCancel = () => {
    setNewUser(initialUserState);
    navigate('/user');
  };

  return (
    <div className="container mt-5" style={{ marginLeft: '180px', width: '500px' }}>
      <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>Tạo người dùng</h1>
      <Form onSubmit={createUser} validated={false}>
        <Form.Group className="mb-3">
          <Form.Label> Tên: </Form.Label>
          <Form.Control
            required
            name="firstName"
            value={newUser.firstName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            type="text"
            isInvalid={touched.firstName && Boolean(errorFirstName)}
            isValid={touched.firstName && !Boolean(errorFirstName)}
          />
          <Form.Control.Feedback type="invalid">{errorFirstName}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Họ:</Form.Label>
          <Form.Control
            name="lastName"
            value={newUser.lastName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            type="text"
            isInvalid={touched.lastName && Boolean(errorLastName)}
            isValid={touched.lastName && !Boolean(errorLastName)}
          />
          <Form.Control.Feedback type="invalid">{errorLastName}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Sinh ngày</Form.Label>
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
            // onKeyDown={e => {
            //   e.preventDefault();
            // }}
          />
          <Form.Control.Feedback type="invalid">{errorDob}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Giới tính</Form.Label>
          <Form.Check className="ml-5" type="radio" id="inline-radio-1" inline>
            <Form.Check.Input
              type="radio"
              defaultChecked
              name="gender"
              value="Female"
              onChange={handleInputChange}
            />
            <Form.Check.Label style={{ paddingTop: 0 }}>Nữ</Form.Check.Label>
          </Form.Check>
          <Form.Check className="ml-5" type="radio" id="inline-radio-2" inline>
            <Form.Check.Input
              type="radio"
              name="gender"
              value="Male"
              onChange={handleInputChange}
            />
            <Form.Check.Label style={{ paddingTop: 0 }}>Nam</Form.Check.Label>
          </Form.Check>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="mr-5">Vai trò</Form.Label>
          <Form.Select
            size="lg"
            aria-label=""
            name="role"
            onChange={handleInputChange}
            isInvalid={touched.role && Boolean(errorType)}
            isValid={touched.role && !Boolean(errorType)}
            onBlur={handleBlur}
          >
            <option value=""></option>
            <option value="ADMIN">Admin</option>
            <option value="STUDENT">Học sinh</option>
            <option value="TEACHER">Giáo Viên</option>
            <option value="MANAGER">Quản lý</option>
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
          Tạo
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

export default CreateUser;
