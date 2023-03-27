import {
  validateName,
} from './validation/validation';
import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ScheduleService from '../../services/scheduleService';
import ClassService from '../../services/classService';
import SubjectService from '../../services/subjectService';

const CreateSchedule = () => {
  let navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    navigate('/schedule');
  };
  const [newAsset, setNewAsset] = useState({
    scheduleTime: '',
    slotName: '',
    className: '',
    subjectName: ''
  });

  const [slots, setSlots] = useState([]);

  const [classList, setClassList] = useState([]);

  const [subjectList, setSubjectList] = useState([]);

  const currentUser = useAuth().user.sub;

  useEffect(() => {
    if (localStorage.getItem('userLocation')) {
      setNewAsset({ ...newAsset, location: localStorage.getItem('userLocation') });
      setNewAsset({ ...newAsset, createdBy: currentUser });
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

  }, []);

  useEffect(() => {
    ScheduleService.getSubjectsByClassName(newAsset.className).then(response => {
      let list = [];
      response.data.forEach(c => {
        list.push(c.subjectName + ' - grade ' + c.subjectGrade);
      });
      setSubjectList(list);
    }).catch(error => {
      console.error(error.response.data);
    });
  }, [newAsset.className]);

  const [touched, setTouched] = useState({
    scheduleTime: false,
    className: false,
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

  const handleSubmit = evt => {
    evt.preventDefault();
    const data = {
      scheduleTime: newAsset.scheduleTime,
      slotName: newAsset.slotName,
      className: newAsset.className,
      subjectName: newAsset.subjectName.replace(/ - grade \d+/, ""),
      subjectGrade: newAsset.subjectName.replace(/.+ - grade /,"")
    }
    ScheduleService.create(data)
      .then(response => {
        toast.success(`Create schedule success!`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate('/schedule');
        }, 2000);
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

  const errorScheduleTime = dateTime => {
    return '';
  };

  const errorClassName = className => {
    if (!className) return 'Vui lòng điền cho thời khóa biểu';
    return '';
  }

  const formValid = true;

  return (
    <div className="container mt-5">
      <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>Create New Schedule</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Schedule Time</Form.Label>
          <Form.Control
            name="scheduleTime"
            value={newAsset.scheduleTime}
            onChange={handleChange}
            onBlur={handleBlur}
            type="date"
            min={new Date().toISOString().split('T')[0]}
            isInvalid={touched.scheduleTime && Boolean(errorScheduleTime(newAsset.scheduleTime))}
            isValid={touched.scheduleTime && !Boolean(errorScheduleTime(newAsset.scheduleTime))}
          />
          <Form.Control.Feedback type="invalid">{errorScheduleTime(newAsset.scheduleTime)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Class</Form.Label>
          <Form.Select style={{ fontSize: '18px' }}
            name="className"
            onChange={handleChange}
            isInvalid={touched.className && Boolean(errorClassName(newAsset.className))}
            isValid={touched.className && !Boolean(errorClassName(newAsset.className))}
            onBlur={handleBlur}
          >
            <option value=""></option>
            {classList.map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errorClassName(newAsset.className)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Slot</Form.Label>
          <Form.Select style={{ fontSize: '18px' }}
            name="slotName"
            onChange={handleChange}
            isInvalid={touched.slotName && Boolean(errorClassName(newAsset.slotName))}
            isValid={touched.slotName && !Boolean(errorClassName(newAsset.slotName))}
            onBlur={handleBlur}
          >
            <option value=""></option>
            {slots.map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errorClassName(newAsset.slotName)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mr-2">Subject</Form.Label>
          <Form.Select style={{ fontSize: '18px' }}
            name="subjectName"
            onChange={handleChange}
            isInvalid={touched.subjectName && Boolean(errorClassName(newAsset.subjectName))}
            isValid={touched.subjectName && !Boolean(errorClassName(newAsset.subjectName))}
            onBlur={handleBlur}
          >
            <option value=""></option>
            {subjectList.map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errorClassName(newAsset.subjectName)}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
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

export default CreateSchedule;
