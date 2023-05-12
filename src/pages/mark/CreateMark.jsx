
import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ScheduleService from '../../services/scheduleService';
import ClassService from '../../services/classService';
import SubjectService from '../../services/subjectService';
import UserService from '../../services/userService';
import MarkService from '../../services/markService';

const CreateMark = () => {
  let navigate = useNavigate();

  const handleClose = () => {
    navigate('/mark');
  };
  const [newAsset, setNewAsset] = useState({
    markValue: 0,
    studentCode: '',
    teacherCode: '',
    subjectId: 0,
    subjectName: '',
    markType: '',
    feedback: ''
  });
  const params = useParams();
  const classId = params.id;
  const userCode = params.code;

  const [subjectList, setSubjectList] = useState([]);

  const [student, setStudent] = useState();

  const currentUser = useAuth().user.userCode;

  useEffect(() => {
    if (localStorage.getItem('userLocation')) {
      setNewAsset({ ...newAsset, location: localStorage.getItem('userLocation') });
      setNewAsset({ ...newAsset, createdBy: currentUser });
    }
    if (userCode) {
      UserService.getByCode(userCode).then(response => {
        console.log(response.data);
        setStudent(response.data);
      }).catch(error => {
        console.error(error.response.data);
      })
    }

  }, []);

  useEffect(() => {
    SubjectService.getAll().then(response => {
      let list = [];
      response.data.forEach(c => {
        if (student != undefined && c.subjectGrade == student.studentClass) {
          list.push(c);
        }
      });
      setSubjectList(list);
    }).catch(error => {
      console.error(error);
    });
  }, [student]);

  const [touched, setTouched] = useState({
    markValue: false,
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
    //console.log(evt.target.value);
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
    let semester = "1";
    if(newAsset.markType.includes("2")){
      semester = "2";
    }
    const data = {
      markValue: newAsset.markValue,
      markType: newAsset.markType,
      teacherCode: currentUser,
      studentCode: userCode,
      markSubjectId: getSubjectId(newAsset.subjectName),
      subjectName: newAsset.subjectName,
      feedback: newAsset.feedback,
      semester: semester
    }
    MarkService.create(data).then(response => {
      toast.success(`Tạo điểm thành công!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate(`/mark/my-class/${classId}/${userCode}`);
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
    if (!className) return 'Vui lòng điền cho thời khóa biểu';
    return '';
  }

  return (
    <div className="container mt-5">
      <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>Tạo điểm</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Điểm số</Form.Label>
          <Form.Control
            name="markValue"
            value={newAsset.markValue}
            onChange={handleChange}
            onBlur={handleBlur}
            type="input"
            isInvalid={touched.markValue && Boolean(errorScheduleTime(newAsset.markValue))}
            isValid={touched.markValue && !Boolean(errorScheduleTime(newAsset.markValue))}
          />
          <Form.Control.Feedback type="invalid">{errorScheduleTime(newAsset.markValue)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Loại</Form.Label>
          <Form.Select style={{ fontSize: '18px' }}
            name="markType"
            onChange={handleChange}
            isInvalid={touched.markType && Boolean(errorClassName(newAsset.markType))}
            isValid={touched.markType && !Boolean(errorClassName(newAsset.markType))}
            onBlur={handleBlur}
          >
            <option value=""></option>
            {/* <option value="1/2semester">Giữa kì</option> */}
            <option value="semester1">Kì 1</option>
            <option value="semester2">Kì 2</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errorClassName(newAsset.markType)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Môn học</Form.Label>
          <Form.Select style={{ fontSize: '18px' }}
            name="subjectName"
            onChange={handleChange}
            isInvalid={touched.subjectName && Boolean(errorClassName(newAsset.subjectName))}
            isValid={touched.subjectName && !Boolean(errorClassName(newAsset.subjectName))}
            onBlur={handleBlur}
          >
            <option value=""></option>
            {subjectList.map(c =>
              <option key={c.subjectId} value={c.subjectName}>{c.subjectName}</option>
            )}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errorClassName(newAsset.subjectName)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Đánh giá</Form.Label>
          <Form.Control
            name="feedback"
            value={newAsset.feedback}
            onChange={handleChange}
            onBlur={handleBlur}
            type="input"
          />
        </Form.Group>

        <Form.Group className="d-flex flex-row-reverse">
          <Button variant="light" className="d-flex mx-2 btn btn-outline-secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" type="submit">
            Save
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default CreateMark;
