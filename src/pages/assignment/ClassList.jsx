import React, { useEffect } from 'react';
import { Table, DatePicker, Modal, Input, Dropdown, Empty } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import 'antd/dist/antd.variable.min.css';
import { FilterFilled } from '@ant-design/icons';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import FilterMenu from './FilterMenu';
import DetailModal from './DetailModal';
import configTableColumns from './tableColumns';
import { stateList } from './stateFilterMenuData';
import './css/AdminAssignList.css';
import useAuth from '../../hooks/useAuth';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import moment from 'moment';
import ClassService from '../../services/classService';
import StudentModal from './StudentModal';
import UserService from '../../services/userService';
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

const AdminAssignList = () => {
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState([]);

  const [customizeEmpty, setCustomizeEmpty] = useState(false);

  const [stateFilterLabel, setStateFilterLabel] = useState('State');

  const [stateFilter, setStateFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [assignedDateFilter, setAssignedDateFilter] = useState('');

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({});

  const currentUsername = useAuth().user.sub;

  const [detailModalData, setDetailModalData] = useState({
    id: 0,
    className: ' ',
    classGrade: ' ',
    formTeacherCode: '',
    listStudentCode: [],
  });
  const [keyValid, setKeyValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const { state } = useLocation();
  let updateList = [];

  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [studentListData, setStudentListData] = useState([]);
  const [selectedUserRows, setSelectedUserRows] = useState();

  const formatState = state => {
    const strArray = state.split('_');
    let newState = '';
    strArray.map(s => {
      newState = newState + String(s).at(0) + String(s).substring(1).toLowerCase() + ' ';
    });
    return newState.trim();
  };

  const [listUser, setListUser] = useState([]);
  const [listClass, setListClass] = useState([]);

  const getAllUsers = async () => {
    const listUser = await UserService.getAllUsers();
    setListUser(listUser.data);
    const listClass = await ClassService.getDefault();
    setListClass(listClass.data);
  }

  const getUserFullName = (code) => {
    let fullName = '';
    listUser.map(u => {
      if(u.userCode == code){
        fullName = u.firstName + ' ' + u.lastName;
      }
    });
    return fullName;
  }

  const setDataList = list => {
    let dataList = [];
    list.map(e => {
      dataList.push({
        id: e.id,
        className: e.className,
        classGrade: e.classGrade,
        formTeacherCode: getUserFullName(e.formTeacherCode),
        listStudentCode: e.listStudentCode,
      });
    });
    setDataSource(dataList);
  };

  const getDefaultList = async () => {
    
  };

  const getListByFilterAndSearch = (stateFilter, assignedDateFilter, searchText) => {
    const searchDate = {
      state: stateFilter,
      assignedDate: assignedDateFilter,
      searchKey: searchText,
    };
    ClassService.getListBySearchKey(searchDate)
      .then(response => {
        setDataList(response.data);
      })
      .catch(error => {
        console.error(error);
        setDataSource([]);
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setDataList(listClass);
  }, [listClass]);

  const showDetailModal = data => {
    ClassService.getByID(data.id).then(response => {
      let data = {
        id: response.data.id,
        className: response.data.className,
        classGrade: response.data.classGrade,
        formTeacherCode: getUserFullName(response.data.formTeacherCode),
        listStudentCode: response.data.listStudentCode,
      }
      setDetailModalData(data);
    });
    setIsDetailModalVisible(true);
  };

  const showDeleteModal = data => {
    setIsDeleteModalVisible(true);
    setDeleteModalData(data);
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


  const handleDeleteModalOK = () => {
    ClassService.deleteClass(deleteModalData.id)
      .then(response => {
        showSuccessMessage('Delete class successfully!');
        setIsDeleteModalVisible(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        setIsDeleteModalVisible(false);
        showErrorMessage(error.response.data);
      });
  };

  const handleStateFilter = event => {
    const selected = Number.isInteger(event.key) ? parseInt(event.key) : event.key;
    if (selected === 'clear') {
      setStateFilterLabel('State');
      setStateFilter('');
      return;
    }
    const stateMap = {
      1: 'Waiting For Acceptance',
      2: 'Accepted',
      3: 'Declined',
      4: 'Waiting For Returning',
    };
    const stateValue = {
      1: 'WAITING_FOR_ACCEPTANCE',
      2: 'ACCEPTED',
      3: 'DECLINED',
      4: 'WAITING_FOR_RETURNING',
    };
    setStateFilterLabel(stateMap[selected]);
    setStateFilter(stateValue[selected]);
  };

  const handleSearch = value => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    setSearchValue(value.trim());
    if (value.trim().length <= 50 && !specialChars.test(value)) {
      setSearchText('do-search');
    }
  };

  const handleTrim = evt => {
    setSearchValue(evt.target.value.trim());
  };

  const handleKey = evt => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    setSearchValue(evt.target.value);
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

  const handleSearchAndFilter = () => {
    setSearchText('');
    if (!stateFilter && !assignedDateFilter && !searchValue) {
      if (updateList.length !== 0) {
        setDataList(updateList);
      } else {
        getDefaultList();
      }
      return;
    } else if (stateFilter && !assignedDateFilter) {
      getListByFilterAndSearch(stateFilter, '', searchValue);
      return;
    } else if (!stateFilter && assignedDateFilter) {
      getListByFilterAndSearch('', assignedDateFilter, searchValue);
      return;
    } else if (!stateFilter && !assignedDateFilter) {
      getListByFilterAndSearch('', '', searchValue);
      return;
    } else if (stateFilter && assignedDateFilter) {
      getListByFilterAndSearch(stateFilter, assignedDateFilter, searchValue);
      return;
    }
  };

  const getDataList = list => {
    let usersList = [];
    list.map(e => {
      usersList.push({
        userCode: e.userCode,
        fullName: e.firstName + ' ' + e.lastName,
        username: e.username,
        roleName: e.roleName,
        gender: e.gender,
        dob: e.dob
      });
    });
    setStudentListData(usersList);
  };

  const showStudentModal = async data => {
    await ClassService.getValidStudents().then(response => {
      getDataList(response.data);

    });
    setIsStudentModalVisible(true);
  };

  const handleCancelStudent = () => {
    if (isStudentModalVisible) {
      setIsStudentModalVisible(false);
      setSelectedUserRows([]);
      return;
    }
  };

  const handleOk = () => {
    setIsStudentModalVisible(false);
    createStudentList(selectedUserRows);
  }

  const createStudentList = data => {
    ClassService.createStudentList(data).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students.xlsx`);
      document.body.appendChild(link);
      link.click();
    });
  }

  useEffect(() => {
    handleSearchAndFilter();
  }, [stateFilter, assignedDateFilter, searchText]);

  const stateFilterMenu = <FilterMenu handleFilter={handleStateFilter} menuList={stateList} />;

  return (
    <div style={{ display: 'block', width: '1000px', marginLeft: '50px' }}>
      <ConfigProvider renderEmpty={customizeEmpty ? customizeRenderEmpty : undefined}>
        <Row justify="start" align="middle">
          <h2 className="title">Danh sách lớp học</h2>
        </Row>
        <Row style={{ marginBottom: '50px' }} className="utility_bar">
          <Col span={7} push={3}>
            <Search
              className="search"
              style={{ width: '200px' }}
              maxLength={51}
              defaultValue=""
              value={searchValue}
              onSearch={handleSearch}
              onChange={handleKey}
              onBlur={handleTrim}
            />
            {keyValid && <div style={{ display: 'block', color: 'red' }}>{errorMsg}</div>}
          </Col>
          <Col span={4} push={3}>
            <button
              type="button"
              className="create_assign"
              style={{ width: '190px' }}
              onClick={() => {
                navigate('/class/create');
              }}
            >
              Tạo mới lớp học
            </button>
          </Col>
          <Col span={4} push={6}>
            <button
              type="button"
              className="create_assign"
              style={{ width: '190px' }}
              onClick={showStudentModal}
            >
              Tạo DS học sinh
            </button>
          </Col>
        </Row>
        <StudentModal
          isDetailModalVisible={isStudentModalVisible}
          handleCancel={handleCancelStudent}
          dataList={studentListData}
          handleOk={handleOk}
          setSelectedRow={setSelectedUserRows}
        />
        <Row className="mt-5">
          <Col span={24}>
            <Table
              rowKey="id"
              pagination={{
                pageSize: 10,
                hideOnSinglePage: true,
                itemRender: itemRender,
              }}
              columns={configTableColumns(
                showDetailModal,
                showDeleteModal,
                navigate
              )}
              dataSource={dataSource}
            />
            <DetailModal
              isDetailModalVisible={isDetailModalVisible}
              handleCancel={handleCancel}
              id={detailModalData.id}
              className={detailModalData.className}
              classGrade={detailModalData.classGrade}
              formTeacherCode={detailModalData.formTeacherCode}
              listStudentCode={detailModalData.listStudentCode}
            />
            <Modal
              title="Bạn có chắc chắn không ?"
              visible={isDeleteModalVisible}
              onCancel={handleCancel}
              onOk={handleDeleteModalOK}
              closable={false}
              width={420}
            >
              <p>Bạn có muốn xóa lớp học {deleteModalData.id} không</p>
            </Modal>
          </Col>
        </Row>
      </ConfigProvider>
    </div>
  );
};

export default AdminAssignList;
