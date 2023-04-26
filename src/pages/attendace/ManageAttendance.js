import React, { useEffect } from 'react';
import './ManageAttendance.css';
import { Table, Modal, Input, Empty } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import 'antd/dist/antd.variable.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ScheduleService from '../../services/scheduleService';
import configTableColumns from './page_settings/tableColumns';
import DetailModal from './components/DetailModal';
import useFilterSearch from './hooks/useFilterSearch';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import useAuth from '../../hooks/useAuth';
import TableBootstrap from 'react-bootstrap/Table';
import axios from 'axios';
import ClassService from '../../services/classService';
import AttendanceService from '../../services/attendaceService';
import UserService from '../../services/userService';
import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Space, Button, Tooltip } from 'antd';

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

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [keyValid, setKeyValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const currentUser = useAuth().user.userCode;
  const [studentList, setStudentList] = useState([]);
  const [allStudent, setAllStudent] = useState([]);
  const [userClass, setUserClass] = useState({});
  const [dateMonth, setDateMonth] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);

  const [detailModalData, setDetailModalData] = useState({
    scheduleId: 0,
    scheduleTime: '',
    scheduleFrom: '',
    scheduleTo: '',
    className: '',
    subjectName: ''
  });
  const [deleteModalData, setDeleteModalData] = useState({});

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
    ScheduleService.getByTeaccher(currentUser)
      .then(response => {
        localStorage.removeItem('nonDefaultList');
        localStorage.setItem('nonDefaultList', JSON.stringify(response.data));
        getClassByName(response.data[0].className);
        setLoading(true);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
    AttendanceService.getAll().then(response => {
      setAttendanceList(response.data);
    });
    UserService.getAllUsers().then(response => {
      setAllStudent(response.data);
    })
  }, []);

  const getClassByName = name => {
    ClassService.getDefault(name).then(response => {
      const foundClass = response.data.filter(el => el.className == name)[0];
      setUserClass(foundClass);
      setStudentList(foundClass.listStudentCode);
    }).catch(error => {
      console.error(error);
    })
  }

  const getStudentName = code => {
    let s = allStudent.filter(el => el.userCode == code)[0];
    return s.firstName + ' ' + s.lastName;
  }

  const checkAttendance = (scheduleId, userCode) => {
    let list = attendanceList.filter(el => (el.scheduleId == scheduleId && el.userCode == userCode));
    if (list[0] == undefined || list[0] == null) {
      return "N/A";
    }
    else if(list[0].isAttended == 'true'){
      return "Có Mặt";
    }
    else {
      return "Nghỉ";
    }
  }

  const getScheduleByTime = (timeDate, timeMonth) => {
    let list = dataSource.filter(el => ((new Date(el.scheduleTime).getDate()) == timeDate && (new Date(el.scheduleTime).getMonth() + 1) == timeMonth));
    console.log(list[0]);
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

  const showDetailModal = data => {
    ScheduleService.getByID(data.scheduleId).then(response => {
      setDetailModalData(response.data);
    });
    setIsDetailModalVisible(true);
  };

  const showDeleteModal = async data => {
    try {
      setIsDeleteModalVisible(true);
      setDeleteModalData(data);
      return;
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (isDetailModalVisible) {
      setIsDetailModalVisible(false);
      return;
    }
    if (isDeleteModalVisible) {
      setIsDeleteModalVisible(false);
      return;
    }
  };

  const handleDeleteModalOK = async () => {
    ScheduleService.deleteById(deleteModalData.scheduleId).then(response => {
      showSuccessMessage('Delete schedule success!');
      setIsDeleteModalVisible(false);
      setDeleteSuccess(true);
    }).catch(error => {
      showErrorMessage('Error: ' + error.response.data);
      setIsDeleteModalVisible(false);
    });
  };

  const handleSearch = value => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (value.trim().length <= 50 && !specialChars.test(value)) {
      setSearchText(value.trim());
      setSearchValue(value.trim());
    }
  };

  const handleTrim = evt => {
    setSearchText(evt.target.value.trim());
  };

  const handleKey = evt => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    setSearchText(evt.target.value);
    if (evt.target.value.length > 50) {
      setKeyValid(true);
      setErrorMsg('The keyword max length is 50 characters');
      return;
    }
    if (specialChars.test(evt.target.value)) {
      setKeyValid(true);
      setErrorMsg('The keyword should not contain special characters');
      return;
    }
    setKeyValid(false);
    setErrorMsg('');
  };
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
        <Row justify="start" align="middle">
          <h2 className="title">Schedule List</h2>
        </Row>
        <Row style={{ marginBottom: '50px' }} className="utility_bar">
          <Col span={8} push={5}>
            <Input.Search
              onSearch={handleSearch}
              onChange={handleKey}
              onBlur={handleTrim}
              style={{
                width: '70%',
              }}
              maxLength={51}
              defaultValue=""
              value={searchText}
            />
            {keyValid && <div style={{ display: 'block', color: 'red' }}>{errorMsg}</div>}
          </Col>
        </Row>
        <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>
          Điểm danh {userClass.className}
        </h1>
        <TableBootstrap bordered hover>
          <thead>
            <tr>
              <th style={{ width: '150px' }}>Ngày/Học sinh</th>
              {studentList.map((el, index) =>
                <th key={index}>{getStudentName(el)}</th>
              )}
              <th></th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </TableBootstrap>
        {/* <Row justify="center" className="asset_table">
          <Col span={24}>
            <Table
              rowKey="scheduleId"
              pagination={{
                pageSize: 10,
                hideOnSinglePage: true,
                itemRender: itemRender,
              }}
              columns={configTableColumns(showDetailModal, showDeleteModal)}
              dataSource={dataSource}
            />
            <DetailModal
              isDetailModalVisible={isDetailModalVisible}
              handleCancel={handleCancel}
              scheduleId={detailModalData.scheduleId}
              scheduleTime={detailModalData.scheduleTime}
              scheduleFrom={detailModalData.scheduleFrom}
              scheduleTo={detailModalData.scheduleTo}
              className={detailModalData.className}
              subjectName={detailModalData.subjectName}
            />
            <Modal
              title="Are you sure ?"
              visible={isDeleteModalVisible}
              onCancel={handleCancel}
              onOk={handleDeleteModalOK}
              okText="Delete"
              closable={false}
              width={420}
            >
              <p>Do you want to delete this schedule {deleteModalData.scheduleId}</p>
            </Modal>
          </Col>
        </Row> */}
      </ConfigProvider>
    </div>
  );
};

export default ManageAttend;
