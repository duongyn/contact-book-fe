import React, { useEffect } from 'react';
import './ManageAttendance.css';
import { Table, Modal, Input, Empty } from 'antd';
import 'antd/dist/antd.variable.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ScheduleService from '../../services/scheduleService';
import useFilterSearch from './hooks/useFilterSearch';
import useAuth from '../../hooks/useAuth';
import TableBootstrap from 'react-bootstrap/Table';
import ClassService from '../../services/classService';
import AttendanceService from '../../services/attendaceService';
import UserService from '../../services/userService';
import { Form } from 'react-bootstrap';
import { Col, Row } from 'antd';
import Moment from 'moment';

const { Search } = Input;

/* Change default theme color */
ConfigProvider.config({
  theme: {
    primaryColor: '#D6001C',
  },
});

const customizeRenderEmpty = () => <Empty description={'No Result'} />;

const itemRender = (_, type, originalElement) => {
  if (type === 'prev') {
    return <a>Previous</a>;
  }
  if (type === 'next') {
    return <a>Next</a>;
  }
  return originalElement;
};

const ManageAttend = () => {
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState([]);

  const [loading, setLoading] = useState(false);

  const [customizeEmpty, setCustomizeEmpty] = useState(false);

  const [searchText, setSearchText] = useState(' ');

  const [searchValue, setSearchValue] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const currentUser = useAuth().user.userCode;
  const [studentList, setStudentList] = useState([]);
  const [allStudent, setAllStudent] = useState([]);
  const [userClass, setUserClass] = useState({});
  const [dateMonth, setDateMonth] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [filterDate, setFilterDate] = useState(Moment().format('yyyy-MM-DD'));


  useEffect(() => {
    ScheduleService.getByTeaccher(currentUser)
      .then(response => {
        localStorage.removeItem('defaultList');
        localStorage.setItem('defaultList', JSON.stringify(response.data));
        setDataSource(response.data);
        setLoading(true);
      })
      .catch(error => {
        setLoading(false);
      });
  }, [deleteSuccess]);

  useEffect(() => {
    createDateList();
    getClassByTeacher(currentUser);
    AttendanceService.getAll().then(response => {
      setAttendanceList(response.data.filter(el => new Date(el.attendDate).getTime() == new Date().getTime()));
    });
    UserService.getAllUsers().then(response => {
      setAllStudent(response.data);
    })
  }, []);

  useEffect(() => {
    AttendanceService.getAll().then(response => {
      setAttendanceList(response.data.filter(el => el.attendDate == filterDate));
    });
  }, [filterDate]);

  const getClassByTeacher = code => {
    ClassService.findByTeacher(code).then(response => {
      setUserClass(response.data);
      if (response.data.listStudentCode.length > 0) {
        setStudentList(response.data.listStudentCode);
      }
    }).catch(error => {
      console.error(error);
    })
  }

  const getStudentName = code => {
    let s = allStudent.filter(el => el.userCode == code)[0];
    if (s) {
      return s.firstName + ' ' + s.lastName;
    }
    return '';
  }

  const getStudentDob = code => {
    let s = allStudent.filter(el => el.userCode == code)[0];
    if (s) {
      return s.dob;
    }
    return '';
  }

  const checkAttendance = (scheduleId, userCode) => {
    let list = attendanceList.filter(el => (el.scheduleId == scheduleId && el.userCode == userCode));
    if (list[0] == undefined || list[0] == null) {
      return "N/A";
    }
    else if (list[0].isAttended == 'true') {
      return "Có Mặt";
    }
    else {
      return "Vắng mặt";
    }
  }

  const checkAttendanceByDate = (scheduleTime, userCode) => {
    let list = attendanceList.filter(el => (el.attendDate == scheduleTime && el.userCode == userCode));
    if (list[0] == undefined || list[0] == null) {
      return "N/A";
    }
    else if (list[0].isAttended == 'true') {
      return <strong style={{ color: 'green' }}>Có Mặt</strong>;
    }
    else {
      return <strong style={{ color: 'red' }}>Vắng mặt</strong>;
    }
  }

  const handleChangeWeek = evt => {
    let current = new Date(evt.target.value)
    setFilterDate(evt.target.value);
  }

  const getScheduleByFilterDate = filterDate => {
    if (filterDate != '') {
      return filterDate;
    }
    let currentDate = new Date();
    return currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate();
  }

  const getScheduleByTime = (timeDate, timeMonth) => {
    let list = dataSource.filter(el => ((new Date(el.scheduleTime).getDate()) == timeDate && (new Date(el.scheduleTime).getMonth() + 1) == timeMonth));
    return (list[0] != undefined && list[0] != null) ? list[0].scheduleId : 0;
  }

  //reload data when filter and search recognized
  useFilterSearch(
    searchText,
    searchValue,
    deleteSuccess,
    setSearchValue,
    setDataSource,
    setCustomizeEmpty
  );

  const getDaysInMonth = (month, year) => (new Array(31)).fill('').map((v, i) => new Date(year, month - 1, i + 1)).filter(v => v.getMonth() === month - 1)

  const createDateList = () => {
    const today = new Date();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    setDateMonth(getDaysInMonth(month, year));
  }

  return (
    <div className="asset__list" style={{ display: 'block', width: '1000px' }}>
      <ConfigProvider renderEmpty={customizeEmpty ? customizeRenderEmpty : undefined}>
        <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>
          Điểm danh lớp {userClass.className}
        </h1>
        <Form.Group className="mb-3">
          <Form.Label className="ml-5">Lọc theo ngày</Form.Label>
          <Form.Control
            name="scheduleTime"
            onChange={handleChangeWeek}
            type="date"
            value={filterDate}
          />
        </Form.Group>
        <Col span={5} push={3}>
          <button type="button" className="create_assign" style={{ width: '190px' }}
            onClick={() => {
              navigate('/attendance/check/'+userClass.className+'/'+filterDate);
            }}>
            Chỉnh sửa điểm danh
          </button>
        </Col>
        <TableBootstrap bordered hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ Tên</th>
              <th>Mã HS</th>
              <th>Ngày sinh</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((u, index) =>
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{getStudentName(u)}</td>
                <td>{u}</td>
                <td>{getStudentDob(u)}</td>
                <td>
                  {checkAttendanceByDate(filterDate, u)}
                </td>
                {/* <td>
                  <Space size="small">
                    <Tooltip title="attendance">
                      <Link to={{ pathname: '/attendance/check/' + getScheduleByFilterDate(filterDate) }}>
                        <Button type="text" icon={<CheckOutlined />} />
                      </Link>
                    </Tooltip>
                  </Space>
                </td> */}
              </tr>
            )}
          </tbody>
          {/* <tbody>
            {dateMonth.map((el, index) =>
              <tr key={index}>
                <td>{el.getDate() + '/' + (el.getMonth() + 1)}</td>
                {studentList.map((u, index) =>
                  <td key={index}>{checkAttendance(getScheduleByTime(el.getDate(), el.getMonth() + 1), u)}</td>
                )}
                <td><Space size="small">
                  <Tooltip title="attendance">
                    <Link to={{ pathname: '/attendance/check/' + getScheduleByTime(el.getDate(), el.getMonth() + 1)}}>
                      <Button type="text" icon={<CheckOutlined />} />
                    </Link>
                  </Tooltip>
                </Space></td>
              </tr>
            )}
            <tr></tr>
          </tbody> */}
        </TableBootstrap>
      </ConfigProvider>
    </div>
  );
};

export default ManageAttend;
