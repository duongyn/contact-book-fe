import React, { useEffect } from 'react';
import { Table, DatePicker, Modal, Input, Dropdown, Empty } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import 'antd/dist/antd.variable.min.css';
import { FilterFilled } from '@ant-design/icons';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AssignService from '../../services/classService';
import FilterMenu from './FilterMenu';
import DetailModal from './DetailModal';
import configTableColumns from './tableColumns';
import { stateList } from './stateFilterMenuData';
import './css/AdminAssignList.css';
import ReturnRequestService from '../../services/returnRequestService';
import useAuth from '../../hooks/useAuth';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import moment from 'moment';
import AssignmentService from '../../services/classService';
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
  const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({});
  const [returnModalData, setReturnModalData] = useState({});

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

  const formatState = state => {
    const strArray = state.split('_');
    let newState = '';
    strArray.map(s => {
      newState = newState + String(s).at(0) + String(s).substring(1).toLowerCase() + ' ';
    });
    return newState.trim();
  };

  const setDataList = list => {
    let dataList = [];
    list.map(e => {
      dataList.push({
        id: e.id,
        className: e.className,
        classGrade: e.classGrade,
        formTeacherCode: e.formTeacherCode,
        listStudentCode: e.listStudentCode,
      });
    });
    setDataSource(dataList);
  };

  const getDefaultList = () => {
    AssignService.getDefault()
      .then(response => {
        setDataList(response.data);
      })
      .catch(() => {
        setDataSource([]);
      });
  };

  const getListByFilterAndSearch = (stateFilter, assignedDateFilter, searchText) => {
    const searchDate = {
      state: stateFilter,
      assignedDate: assignedDateFilter,
      searchKey: searchText,
    };
    AssignService.getListBySearchKey(searchDate)
      .then(response => {
        setDataList(response.data);
      })
      .catch(error => {
        console.error(error);
        setDataSource([]);
      });
  };

  useEffect(() => {
    if (state) {
      updateList = [];
      if (state.prePath === '/assignment/edit') {
        updateList.push(state.updatedAssignment);
        async function getUpdateList() {
          let response = await AssignService.getDefault();
          response.data
            .filter(assign => assign.id !== state.updatedAssignment.id)
            .map(assign => {
              updateList.push(assign);
            });
          setDataList(updateList);
        }
        getUpdateList();
        navigate('/assignment', { state: {} });
      }
      if (state.prePath === '/class/create') {
        updateList.push(state.createdAssignment);
        async function getUpdateList() {
          let response = await AssignService.getDefault();
          response.data
            .filter(assign => assign.id !== state.createdAssignment.id)
            .map(assign => {
              updateList.push(assign);
            });
          setDataList(updateList);
        }
        getUpdateList();
        navigate('/assignment', { state: {} });
      }
    } else {
      getDefaultList();
    }
  }, []);

  const showDetailModal = data => {
    AssignService.getByID(data.id).then(response => {
      setDetailModalData(response.data);
    });
    setIsDetailModalVisible(true);
  };

  const showDeleteModal = data => {
    setIsDeleteModalVisible(true);
    setDeleteModalData(data);
  };

  const showReturnModal = data => {
    setIsReturnModalVisible(true);
    setReturnModalData(data.id);
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
    if (isReturnModalVisible) {
      setIsReturnModalVisible(false);
      return;
    }
  };

  const handleAssignedDate = event => {
    if (event) {
      setAssignedDateFilter(event.format('yyyy-MM-DD'));
    } else {
      setAssignedDateFilter('');
    }
  };

  const handleReturnModalOK = () => {
    const requestDto = {
      assignmentId: returnModalData,
    };
    ReturnRequestService.createReturnRequest(requestDto)
      .then(response => {
        showSuccessMessage('Success create return request!');
        setIsReturnModalVisible(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        setIsReturnModalVisible(false);
        showErrorMessage('Error: ' + error.response.data);
      });
  };

  const handleDeleteModalOK = () => {
    AssignmentService.deleteAssignment(deleteModalData.id)
      .then(response => {
        showSuccessMessage('Delete Assignment successfully !');
        setIsDeleteModalVisible(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        setIsDeleteModalVisible(false);
        showErrorMessage('Error: ' + error.response.data);
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

  useEffect(() => {
    handleSearchAndFilter();
  }, [stateFilter, assignedDateFilter, searchText]);

  const stateFilterMenu = <FilterMenu handleFilter={handleStateFilter} menuList={stateList} />;

  return (
    <div style={{ display: 'block', width: '1300px' }}>
      <ConfigProvider renderEmpty={customizeEmpty ? customizeRenderEmpty : undefined}>
        <Row justify="start" align="middle">
          <h2 className="title">Assignment List</h2>
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
              Create new class
            </button>
          </Col>
        </Row>
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
                showReturnModal,
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
              title="Are you sure ?"
              visible={isDeleteModalVisible}
              onCancel={handleCancel}
              onOk={handleDeleteModalOK}
              closable={false}
              width={420}
            >
              <p>Do you want to delete this assignment {deleteModalData.id}</p>
            </Modal>
            <Modal
              title="Are you sure ?"
              visible={isReturnModalVisible}
              onCancel={handleCancel}
              onOk={handleReturnModalOK}
              okText="Yes"
              cancelText="No"
              closable={false}
              width={420}
            >
              <p>Do you want to create a returning request for this asset?</p>
            </Modal>
          </Col>
        </Row>
      </ConfigProvider>
    </div>
  );
};

export default AdminAssignList;
