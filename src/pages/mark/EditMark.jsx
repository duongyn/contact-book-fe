
import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import SubjectService from '../../services/subjectService';
import UserService from '../../services/userService';
import MarkService from '../../services/markService';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';

const EditMark = () => {
  let navigate = useNavigate();

  const handleClose = () => {
    navigate('/mark');
  };
  const [newAsset, setNewAsset] = useState({
    markId: 0,
    halfMark: 0,
    semesterMark: 0,
    finalMark: 0,
    halfFeedback: '',
    semesterFeedback: '',
    studentCode: '',
    teacherCode: '',
    subjectId: 0,
    subjectName: '',
  });
  const params = useParams();
  const userCode = params.code;
  const markId = params.markid;

  const [subjectList, setSubjectList] = useState([]);

  const [student, setStudent] = useState();

  const currentUser = useAuth().user.userCode;

  useEffect(() => {
    if (userCode) {
      UserService.getByCode(userCode).then(response => {
        setStudent(response.data);
      }).catch(error => {
        console.error(error.response.data);
      })
    }
    if (markId) {
      MarkService.findById(markId).then(response => {
        setNewAsset(response.data);
      }).catch(error => {
        showErrorMessage('Error: ' + error);
      });
    }

  }, []);

  useEffect(() => {
    SubjectService.getAll().then(response => {
      let list = [];
      response.data.forEach(c => {
        if (student != undefined && c.subjectGrade == student.studentClass.replace(/[a-zA-Z]+/gm,"")) {
          list.push(c);
        }
      });
      setSubjectList(list);
    }).catch(error => {
      console.error(error);
    });
  }, [student]);

  const [touched, setTouched] = useState({
    halfMark: false,
    markType: false,
    subjectName: false
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
  };

  const getSubjectId = name => {
    let id = 0;
    subjectList.forEach(el => {
      if (el.subjectName == name) {
        id = el.subjectId;
      }
    });
    return id;
  }

  const handleSubmit = evt => {
    evt.preventDefault();
    MarkService.create(newAsset).then(response => {
      toast.success(`Sửa điểm thành công!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate(`/mark/my-class/${userCode}`);
      }, 2000);
    }).catch(e => {
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

  const errorScheduleTime = dateTime => {
    return '';
  };

  const errorClassName = className => {
    if (!className) return 'Vui lòng không bỏ trống!';
    return '';
  }

  return (
    <div className="container mt-5">
      <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>Sửa điểm kỳ {newAsset.semester}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Điểm giữa kì</Form.Label>
          <Form.Control
            name="halfMark"
            value={newAsset.halfMark}
            onChange={handleChange}
            onBlur={handleBlur}
            type="input"
          />
          <Form.Control.Feedback type="invalid">{errorScheduleTime(newAsset.halfMark)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Điểm cuối kì</Form.Label>
          <Form.Control
            name="semesterMark"
            value={newAsset.semesterMark}
            onChange={handleChange}
            onBlur={handleBlur}
            type="input"
          />
          <Form.Control.Feedback type="invalid">{errorScheduleTime(newAsset.halfMark)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Môn học</Form.Label>
          <Form.Control
            name="semesterMark"
            value={newAsset.subjectName}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled
            type="input"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Đánh giá GK</Form.Label>
          <Form.Control
            name="halfFeedback"
            value={newAsset.halfFeedback}
            onChange={handleChange}
            onBlur={handleBlur}
            type="input"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Đánh giá CK</Form.Label>
          <Form.Control
            name="semesterFeedback"
            value={newAsset.semesterFeedback}
            onChange={handleChange}
            onBlur={handleBlur}
            type="input"
          />
        </Form.Group>

        <Form.Group className="d-flex flex-row-reverse">
          <Button variant="light" className="d-flex mx-2 btn btn-outline-secondary" type="button" onClick={handleClose}>
            Hủy bỏ
          </Button>
          <Button variant="danger" type="submit">
            Lưu
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default EditMark;
