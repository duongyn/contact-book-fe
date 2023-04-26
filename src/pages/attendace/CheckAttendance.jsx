import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleService from '../../services/scheduleService';
import './CreateSchedule.css';
import useAuth from '../../hooks/useAuth';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import UserService from '../../services/userService';
import Table from 'react-bootstrap/Table';
import AttendanceService from '../../services/attendaceService';

const CheckAttendance = () => {
  const currentUser = useAuth().user.sub;

  const initialSubjectState = {
    scheduleId: 0,
    scheduleTime: '',
    slotName: '',
    className: '',
    subjectName: '',
    subjectGrade: '',
    updatedBy: currentUser,
  };

  let navigate = useNavigate();
  const [newSubject, setNewSubject] = useState(initialSubjectState);
  const params = useParams();
  const scheduleid = params.scheduleid;

  const [userList, setUserList] = useState([]);
  const [checkboxList, setCheckboxList] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);

  useEffect(() => {
    if(scheduleid == 0) {
      showErrorMessage('Không tìm thấy thời khóa biểu nào cho ngày ');
          setTimeout(() => {
            navigate('/attendance');
          }, 3000);
    }
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
          getAllUserByClass(response.data.className)
        })
        .catch(e => {
          showErrorMessage('Error: ' + e.response.data);
          setTimeout(() => {
            navigate('/attendance');
          }, 3000);
          console.error(e.response.data);
        });
    }
    
  }, [scheduleid]);

  useEffect(() => {
    AttendanceService.getAll().then(response => {
      setAttendanceList(response.data);
    });
    AttendanceService.getAll().then(response => {
      let list = [];
      response.data.filter(el => el.scheduleId == scheduleid && el.isAttended == 'true').forEach(el => {
        list.push(el.userCode);
      });
      setCheckboxList(list);
    });
  }, []);

  const handleCheckboxChange = evt => {
    if (evt.target.checked) {
      setCheckboxList(checkboxList.filter((item) => item != evt.target.value).concat(evt.target.value))
    }
    else {
      setCheckboxList(checkboxList.filter((item) => item != evt.target.value))
    }
  }

  const getAllUserByClass = name => {
    UserService.getAllUsersByClass(name).then(response => {
      setUserList(response.data);
    }
    ).catch(err => {
      console.error(err.response.data);
    });
  }
  
  const onSubmit = e => {
    e.preventDefault();
    userList.filter(el => checkboxList.indexOf(el.userCode) < 0).forEach(el => {
      let data = {
        userCode: el.userCode,
        scheduleId: scheduleid,
        className: newSubject.className,
        checkBy: currentUser,
        isAttended: 'false'
      }
      AttendanceService.create(data).then(response => {
      }).catch(error => {
        console.error(error.response.data);
      });
    })
    checkboxList.forEach(el => {
      let data = {
        userCode: el,
        scheduleId: scheduleid,
        className: newSubject.className,
        checkBy: currentUser,
        isAttended: 'true'
      }
      AttendanceService.create(data).then(response => {
      }).catch(error => {
        console.error(error.response.data);
      });
    });
    showSuccessMessage('Điểm danh thành công');
    setTimeout(() => {
      navigate('/attendance');
    }, 3000);
  }

  const onCancel = () => {
    setNewSubject(initialSubjectState);
    navigate('/attendance');
  };

  const isCheckAttend = code => {
    let check = false;
    attendanceList.filter(el => el.userCode == code && el.scheduleId == scheduleid).forEach(el => {
      if(el.isAttended == 'true'){
        check = true;
      }
    });
    return check;
  }

  return (
    <div className="container mt-5" style={{ marginLeft: '50px', width: '800px', fontSize: '16pt' }}>
      <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>Điểm danh lớp {newSubject.className}</h1>
      <Table bordered hover style={{ width: '1000px' }}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã HS</th>
            <th>Họ</th>
            <th>Tên</th>
            <th>Username</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userList.map((el, index) =>
            <tr key={index+1}>
              <td>{index+1}</td>
              <td>{el.userCode}</td>
              <td>{el.lastName}</td>
              <td>{el.firstName}</td>
              <td>{el.username}</td>
              <td><input type="checkbox" name={el.userCode} value={el.userCode} defaultChecked={isCheckAttend(el.userCode)} onChange={handleCheckboxChange} style={{ width: '20px' }} />
              </td>
            </tr>
          )}

        </tbody>
      </Table>
      <div style={{ marginTop: '100px' }}>
        <Button
          style={{ marginLeft: '550px' }}
          variant="danger"
          type="button"
          onClick={onSubmit}
        >
          Lưu
        </Button>
        <Button
          style={{ float: 'right', marginRight: '10px' }}
          variant="light"
          onClick={onCancel}
          className="btn btn-outline-secondary"
          type="button"
        >
          Hủy bỏ
        </Button>
      </div>

    </div>
  );
};

export default CheckAttendance;
