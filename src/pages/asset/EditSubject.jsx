import { validateDate, validateJoinedDate, validateType } from './validation/validation';
import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SubjectService from '../../services/subjectService';
import './CreateSubject.css';
import useAuth from '../../hooks/useAuth';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import instance from '../../httpClient/axiosInstance';
import authHeader from '../../services/AuthHeader';

const EditSubject = () => {
  const currentUser = useAuth().user.sub;

  const initialSubjectState = {
    subjectId: 0,
    subjectName: '',
    subjectGrade: '',
    updatedBy: currentUser,
  };

  let navigate = useNavigate();
  const [newSubject, setNewSubject] = useState(initialSubjectState);
  const params = useParams();
  const subjectId = params.subjectid;

  useEffect(() => {
    if (subjectId) {
      SubjectService.getByID(subjectId)
        .then(response => {
          setNewSubject(response.data);
        })
        .catch(e => {
          showErrorMessage('Error: ' + e.response.data);
          setTimeout(() => {
            navigate('/subject');
          }, 3000);
          console.error(e.response.data);
        });
    }
  }, [subjectId]);

  const [touched, setTouched] = useState({
    subjectName: false,
    subjectGrade: false,
  });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setNewSubject({ ...newSubject, [name]: value});
    console.log({ name, value });
  };

  const handleBlur = evt => {
    setTouched({
      ...touched,
      [evt.target.name]: true,
    });
  };

  const editSubject = e => {
    e.preventDefault();
    instance
      .put('/subjects', newSubject, { headers: authHeader() })
      .then(response => {
        showSuccessMessage(`Edit subject success!`);
        setTimeout(() => {
          navigate('/subject');
        }, 2000);
      })
      .catch(e => {
        showErrorMessage('Error: ' + e.response.data);
        console.error(e);
      });
  };

  const formValid = true;

  const onCancel = () => {
    setNewSubject(initialSubjectState);
    navigate('/subject');
  };

  return (
    <div className="container mt-5" style={{ marginLeft: '180px', width: '500px' }}>
      <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>Chỉnh sửa môn học</h1>
      <Form onSubmit={editSubject} validated={false}>
        <Form.Group className="mb-3">
          <Form.Label> Tên môn học </Form.Label>
          <Form.Control name="subjectName" value={newSubject.subjectName} onChange={handleInputChange} type="text" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Khối</Form.Label>
          <Form.Control name="subjectGrade" value={newSubject.subjectGrade} onChange={handleInputChange} type="text" />
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

export default EditSubject;
