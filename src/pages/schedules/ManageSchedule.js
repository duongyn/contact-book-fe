import React, { useEffect } from 'react';
import './ManageSchedule.css';
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
import ClassService from '../../services/classService';
import { Button, Form } from 'react-bootstrap';
import TableBootstrap from 'react-bootstrap/Table';
import axios from 'axios';

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

const ManageAsset = () => {
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [classList, setClassList] = useState([]);

  const [loading, setLoading] = useState(false);

  const [customizeEmpty, setCustomizeEmpty] = useState(false);

  const [searchText, setSearchText] = useState(' ');

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [week, setWeek] = useState([]);
  const [currentClass, setCurrentClass] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const [showUploadModal, setShowUploadModal] = useState(false);

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
    ScheduleService.getAll()
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
    ScheduleService.getAll()
      .then(response => {
        localStorage.removeItem('nonDefaultList');
        localStorage.setItem('nonDefaultList', JSON.stringify(response.data));
        setLoading(true);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
    ClassService.getDefault()
      .then(response => {
        setClassList(response.data);
      }).catch(error => {
        console.error(error);
      })
  }, []);

  const showSchedulesByClass = evt => {
    setFilterDate('');
    if (evt.target.value == undefined || evt.target.value == '' || evt.target.value == null) {
      setFilterList([]);
      setCurrentClass('');
      return;
    }
    let list = dataSource.filter(el => el.className == evt.target.value);
    setCurrentClass(evt.target.value)
    setFilterList(list);
  }

  const handleChangeWeek = evt => {
    let current = new Date(evt.target.value)
    setFilterDate(evt.target.value);
    var week = new Array();
    current.setDate((current.getDate() - current.getDay() + 1));
    for (var i = 0; i < 7; i++) {
      week.push(
        new Date(current)
      );
      current.setDate(current.getDate() + 1);
    }
    let list = [];
    if (currentClass != '') {
      list = dataSource.filter(el => el.className == currentClass);
    }
    list = list.filter(el => new Date(el.scheduleTime) >= week[0] && new Date(el.scheduleTime) < week[6]);
    setFilterList(list);
    setWeek(week);
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

  const handleCancel = () => {
    if (isDetailModalVisible) {
      setIsDetailModalVisible(false);
      return;
    }
    if (isDeleteModalVisible) {
      setIsDeleteModalVisible(false);
      return;
    }
    if(showUploadModal) {
      setShowUploadModal(false);
    }
  };

  const handleOkUpload = () => {
    setShowUploadModal(false)
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
      axios.post('http://localhost:8080/schedules/add-schedule-excel',
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }).then(response => {
          showSuccessMessage(`Tạo danh sách thời khóa biểu thành công`);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }).catch(error => {
          if (error.response.data) {
            showErrorMessage("Import thất bại "+error.response.data);
          }
          else {
            showErrorMessage("Import thất bại "+error);
          }
        });
    }
  }

  const onFileChange = evt => {
    setSelectedFile(evt.target.files[0]);
    setShowUploadModal(true)
  }

  return (
    <div className="asset__list" style={{ display: 'block', width: '1000px' }}>
      <ConfigProvider renderEmpty={customizeEmpty ? customizeRenderEmpty : undefined}>
        <Row justify="start" align="middle">
          <h2 className="title">Schedule List</h2>
        </Row>
        <Row className="utility_bar">
          <Col span={3}>
            <button
              type="button"
              style={{ paddingTop: '6px' }}
              className="create_button"
              onClick={() => {
                navigate('/schedule/create');
              }}
            >
              Tạo TKB
            </button>
          </Col>
        </Row>
        <Row>
          <Form.Group className="mb-3">
            <Form.Label className="mr-5">Import DS Thời Khóa Biểu</Form.Label>
            <Form.Control readOnly name="scheduleList" type="file" onChange={onFileChange} />
          </Form.Group>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Form.Group className="mb-3">
            <Form.Label>Chọn Lớp</Form.Label>
            <Form.Select style={{ fontSize: '18px' }}
              name="className"
              onChange={showSchedulesByClass}
            >
              <option value=""></option>
              {classList.map((c, index) =>
                <option key={index} value={c.className}>{c.className}</option>
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="ml-5">Lọc theo tuần</Form.Label>
            <Form.Control
              name="scheduleTime"
              onChange={handleChangeWeek}
              type="date"
              value={filterDate}
              disabled={currentClass == ''}
            // min={new Date().toISOString().split('T')[0]}
            />
          </Form.Group>
        </Row>
        <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>
          Thời khóa biểu {currentClass != '' ? 'lớp ' + currentClass : ''} tuần {week.length > 0 ? week[0].getDate() + '/' + week[0].getMonth()+1 + ' - ' + week[6].getDate() + '/' + week[6].getMonth()+1 : 'này'}
        </h1>
        <TableBootstrap bordered hover style={{ width: '1000px' }}>
          <thead>
            <tr>
              <th>Tiết/Ngày</th>
              <th>Thứ Hai</th>
              <th>Thứ Ba</th>
              <th>Thứ Tư</th>
              <th>Thứ Năm</th>
              <th>Thứ Sáu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tiết 1 (7:00 - 8:30)</td>
              <td>{filterList.filter(el => el.slotName.includes("1") && new Date(el.scheduleTime).getDay() == 1).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("1") && new Date(el.scheduleTime).getDay() == 2).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("1") && new Date(el.scheduleTime).getDay() == 3).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("1") && new Date(el.scheduleTime).getDay() == 4).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("1") && new Date(el.scheduleTime).getDay() == 5).map(el => el.subjectName)}</td>
            </tr>
            <tr>
              <td>Tiết 2 (8:45 - 10:15)</td>
              <td>{filterList.filter(el => el.slotName.includes("2") && new Date(el.scheduleTime).getDay() == 1).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("2") && new Date(el.scheduleTime).getDay() == 2).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("2") && new Date(el.scheduleTime).getDay() == 3).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("2") && new Date(el.scheduleTime).getDay() == 4).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("2") && new Date(el.scheduleTime).getDay() == 5).map(el => el.subjectName)}</td>
            </tr>
            <tr>
              <td>Tiết 3 (10:30 - 12:00)</td>
              <td>{filterList.filter(el => el.slotName.includes("3") && new Date(el.scheduleTime).getDay() == 1).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("3") && new Date(el.scheduleTime).getDay() == 2).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("3") && new Date(el.scheduleTime).getDay() == 3).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("3") && new Date(el.scheduleTime).getDay() == 4).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("3") && new Date(el.scheduleTime).getDay() == 5).map(el => el.subjectName)}</td>
            </tr>
            <tr><td style={{ textAlign: 'center', fontSize: '20px', backgroundColor: '#C3BDC3' }} colSpan={6}>Giờ nghỉ trưa</td></tr>
            <tr>
              <td>Tiết 4 (13:00 - 14:30)</td>
              <td>{filterList.filter(el => el.slotName.includes("4") && new Date(el.scheduleTime).getDay() == 1).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("4") && new Date(el.scheduleTime).getDay() == 2).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("4") && new Date(el.scheduleTime).getDay() == 3).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("4") && new Date(el.scheduleTime).getDay() == 4).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("4") && new Date(el.scheduleTime).getDay() == 5).map(el => el.subjectName)}</td>
            </tr>
            <tr>
              <td>Tiết 5 (14:45 - 16:15)</td>
              <td>{filterList.filter(el => el.slotName.includes("5") && new Date(el.scheduleTime).getDay() == 1).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("5") && new Date(el.scheduleTime).getDay() == 2).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("5") && new Date(el.scheduleTime).getDay() == 3).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("5") && new Date(el.scheduleTime).getDay() == 4).map(el => el.subjectName)}</td>
              <td>{filterList.filter(el => el.slotName.includes("5") && new Date(el.scheduleTime).getDay() == 5).map(el => el.subjectName)}</td>
            </tr>
          </tbody>
        </TableBootstrap>
        <Modal
          title="Are you sure ?"
          visible={showUploadModal}
          onCancel={handleCancel}
          onOk={handleOkUpload}
          okText="Import"
          closable={false}
          width={420}
        >
          <p>Bạn có muốn import danh sách thời khóa biểu này không?</p>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default ManageAsset;
