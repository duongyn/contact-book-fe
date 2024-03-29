
import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
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
    markType: '',
    halfMark: 0,
    semesterMark: 0,
    finalMark: 0,
    halfFeedback: '',
    semesterFeedback: '',
    studentCode: '',
    teacherCode: '',
    subjectId: 0,
    subjectName: '',
    feedback: ''
  });
  const params = useParams();
  const userCode = params.code;

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
    let halfMark = 0;
    let sMark = 0;
    let halfFeedback = '';
    let sFeedback = '';
    if(newAsset.markType == "halfsemester1" || newAsset.markType == "halfsemester2") {
      halfMark = newAsset.markValue;
      halfFeedback = newAsset.feedback;
    }
    else if(newAsset.markType == "semester1" || newAsset.markType == "semester2"){
      sMark = newAsset.markValue;
      sFeedback = newAsset.feedback;
    }
    const data = {
      halfMark: halfMark,
      semesterMark: sMark,
      finalMark: newAsset.finalMark,
      halfFeedback: halfFeedback,
      semesterFeedback: sFeedback,
      teacherCode: currentUser,
      studentCode: userCode,
      markSubjectId: getSubjectId(newAsset.subjectName),
      subjectName: newAsset.subjectName,
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
          />
          <Form.Control.Feedback type="invalid">{errorScheduleTime(newAsset.markValue)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Loại</Form.Label>
          <Form.Select style={{ fontSize: '18px' }}
            name="markType"
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value=""></option>
            <option value="halfsemester1">Giữa kì I</option>
            <option value="semester1">Kì I</option>
            <option value="halfsemester2">Giữa kì II</option>
            <option value="semester2">Kì II</option>
          </Form.Select>
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
