import {
  validateName,
} from './validation/validation';
import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import instance from '../../httpClient/axiosInstance';
import authHeader from '../../services/AuthHeader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const CreateSubject = () => {
  let navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    navigate('/subject');
  };
  const [newAsset, setNewAsset] = useState({
    subjectName: '',
    subjectGrade: ''
  });

  const currentUser = useAuth().user.sub;

  useEffect(() => {
    if (localStorage.getItem('userLocation')) {
      setNewAsset({ ...newAsset, location: localStorage.getItem('userLocation') });
      setNewAsset({ ...newAsset, createdBy: currentUser });
    }
  }, []);

  const [touched, setTouched] = useState({
    subjectName: false,
    subjectGrade: false
  });

  const handleBlur = evt => {
    setTouched({
      ...touched,
      [evt.target.name]: true,
    });
  };

  const handleChange = evt => {
    setNewAsset({
      ...newAsset,
      [evt.target.name]: evt.target.value,
    });
    //console.log(evt.target.value);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    console.log(newAsset);
    instance
      .post('/subjects', newAsset, { headers: authHeader() })
      .then(response => {
        toast.success(`Create subject success!`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate('/subject');
        }, 2000);
        //console.log("response = ", response);
      })
      .catch(e => {
        toast.error(e.response.data, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error(e);
      });
  };

  const errorName = validateName(newAsset.subjectName);

  const formValid = !errorName;

  return (
    <div className="container mt-5">
      <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>Tạo mới môn học</h1>
      <Form onSubmit={handleSubmit} validated={false}>
        <Form.Group className="row mb-3">
          <Form.Label className="col-sm-4 col-form-label"> Tên môn học </Form.Label>
          <div className="col-sm-8">
            <Form.Control
              required
              name="subjectName"
              style={{ width: '150%' }}
              value={newAsset.assetName}
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              isInvalid={touched.subjectName && Boolean(errorName)}
              isValid={touched.subjectName && !Boolean(errorName)}
            />
            <Form.Control.Feedback type="invalid">{errorName}</Form.Control.Feedback>
            <Form.Control.Feedback type="valid"></Form.Control.Feedback>
          </div>
        </Form.Group>

        <Form.Group className="row mb-3">
          <Form.Label className="col-sm-4 col-form-label"> Khối </Form.Label>
          <div className="col-sm-8">
            <Form.Control
              required
              name="subjectGrade"
              style={{ width: '150%' }}
              value={newAsset.assetName}
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              isInvalid={touched.subjectGrade && Boolean(errorName)}
              isValid={touched.subjectGrade && !Boolean(errorName)}
            />
            <Form.Control.Feedback type="invalid">{errorName}</Form.Control.Feedback>
            <Form.Control.Feedback type="valid"></Form.Control.Feedback>
          </div>
        </Form.Group>

        <Form.Group className="d-flex flex-row-reverse">
          <Button variant="light" className="d-flex mx-2 btn btn-outline-secondary" type="button" onClick={handleClose}>
            Hủy bỏ
          </Button>
          <Button disabled={!formValid} variant="danger" type="submit">
            Tạo
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default CreateSubject;
