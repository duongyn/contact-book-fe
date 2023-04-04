import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleService from '../../services/scheduleService';
import './CreateSchedule.css';
import useAuth from '../../hooks/useAuth';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import ClassService from '../../services/classService';
import SubjectService from '../../services/subjectService';

const EditSchedule = () => {
  const currentUser = useAuth().user.sub;

  const initialSubjectState = {
    scheduleId: 0,
    scheduleTime: '',
    slotName: '',
    className: '',
    updatedBy: currentUser,
    subjectGrade: '',
    subjectName: ''
  };

  let navigate = useNavigate();
  const [newSubject, setNewSubject] = useState(initialSubjectState);
  const params = useParams();
  const scheduleid = params.scheduleid;

  const [slots, setSlots] = useState([]);
  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  useEffect(() => {
    if (scheduleid) {
      ScheduleService.getByID(scheduleid)
        .then(response => {
          let data = {
            scheduleId: response.data.scheduleId,
            scheduleTime: response.data.scheduleTime,
            slotName: response.data.slotName,
            className: response.data.className,
            updatedBy: currentUser,
            subjectName: response.data.subjectName + ' - grade '+response.data.subjectGrade,
          }
          setNewSubject(data);
        })
        .catch(e => {
          showErrorMessage('Error: ' + e.response.data);
          setTimeout(() => {
            navigate('/schedule');
          }, 3000);
          console.error(e.response.data);
        });
    }
    ScheduleService.getSlots().then(response => {
      let list = [];
      response.data.forEach(c => {
        list.push(c.slotName);
      });
      setSlots(list);
    }).catch(error => {
      console.error(error.response.data);
    });

    ClassService.getDefault().then(response => {
      let list = [];
      response.data.forEach(c => {
        list.push(c.className);
      });

      setClassList(list);
    }).catch(error => {
      console.error(error.response.data);
    });

    SubjectService.getAll().then(response => {
      let list = [];
      response.data.forEach(c => {
        list.push(c.subjectName + ' - grade ' + c.subjectGrade);
      });
      setSubjectList(list);
    }).catch(error => {
      console.error(error.response.data);
    });
  }, [scheduleid]);

  useEffect(() => {
    ScheduleService.getSubjectsByClassName(newSubject.className).then(response => {
      let list = [];
      response.data.forEach(c => {
        list.push(c.subjectName + ' - grade ' + c.subjectGrade);
      });
      setSubjectList(list);
    }).catch(error => {
      console.error(error.response.data);
    });
  }, [newSubject.className]);

  const [touched, setTouched] = useState({
    scheduleTime: false,
    className: false,
    subjectName: false
  });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setNewSubject({ ...newSubject, [name]: value });
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
    const data = {
      scheduleTime: newSubject.scheduleTime,
      slotName: newSubject.slotName,
      className: newSubject.className,
      subjectName: newSubject.subjectName.replace(/ - grade \d+/, ""),
      subjectGrade: newSubject.subjectName.replace(/.+ - grade /, "")
    }

    ScheduleService.update(data)
      .then(response => {
        showSuccessMessage(`Edit schedule success!`);
        setTimeout(() => {
          navigate('/schedule');
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
    navigate('/schedule');
  };

  const errorScheduleTime = dateTime => {
    return '';
  };

  const errorClassName = className => {
    if (!className) return 'Vui lòng điền cho thời khóa biểu';
    return '';
  }

  return (
    <div className="container mt-5" style={{ marginLeft: '180px', width: '500px' }}>
      <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>Edit Schedule</h1>
      <Form onSubmit={editSubject} validated={false}>
        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Schedule Time</Form.Label>
          <Form.Control
            name="scheduleTime"
            value={newSubject.scheduleTime}
            onChange={handleInputChange}
            onBlur={handleBlur}
            type="date"
            min={new Date().toISOString().split('T')[0]}
            isInvalid={touched.scheduleTime && Boolean(errorScheduleTime(newSubject.scheduleTime))}
            isValid={touched.scheduleTime && !Boolean(errorScheduleTime(newSubject.scheduleTime))}
          />
          <Form.Control.Feedback type="invalid">{errorScheduleTime(newSubject.scheduleTime)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Class</Form.Label>
          <Form.Select style={{ fontSize: '18px' }}
            name="className"
            onChange={handleInputChange}
            isInvalid={touched.className && Boolean(errorClassName(newSubject.className))}
            isValid={touched.className && !Boolean(errorClassName(newSubject.className))}
            onBlur={handleBlur}
            value={newSubject.className}
          >
            <option value=""></option>
            {classList.map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errorClassName(newSubject.className)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Slot</Form.Label>
          <Form.Select style={{ fontSize: '18px' }}
            name="slotName"
            onChange={handleInputChange}
            isInvalid={touched.slotName && Boolean(errorClassName(newSubject.slotName))}
            isValid={touched.slotName && !Boolean(errorClassName(newSubject.slotName))}
            onBlur={handleBlur}
            value={newSubject.slotName}
          >
            <option value=""></option>
            {slots.map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errorClassName(newSubject.slotName)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Subject</Form.Label>
          <Form.Select style={{ fontSize: '18px' }}
            name="subjectName"
            onChange={handleInputChange}
            isInvalid={touched.subjectName && Boolean(errorClassName(newSubject.subjectName))}
            isValid={touched.subjectName && !Boolean(errorClassName(newSubject.subjectName))}
            onBlur={handleBlur}
            value={newSubject.subjectName}
          >
            <option value=""></option>
            {subjectList.map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errorClassName(newSubject.subjectName)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>
        <Button
          style={{ marginLeft: '240px' }}
          disabled={!formValid}
          variant="danger"
          type="submit"
        >
          Save
        </Button>
        <Button
          style={{ float: 'right', marginRight: '80px' }}
          variant="light"
          onClick={onCancel}
          className="btn btn-outline-secondary"
          type="button"
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default EditSchedule;
