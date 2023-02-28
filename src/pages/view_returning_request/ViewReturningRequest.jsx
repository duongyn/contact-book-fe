import React, { useEffect } from 'react';
import { Table, DatePicker, Modal, Input, Dropdown, message } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import 'antd/dist/antd.variable.min.css';
import { FilterFilled } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import RequestService from '../../services/viewRequestService';
import FilterMenu from './FilterMenu';
import configTableColumns from './tableColumns';
import { stateList } from './stateFilterMenuData';
import './css/ViewReturnedRequest.css';
import DetailModal from './DetailModal';
import { END_POINT } from '../../httpClient/config';
import instance from '../../httpClient/axiosInstance';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import UserService from '../../services/userService';

const { Search } = Input;

/* Change default theme color */
ConfigProvider.config({
  theme: {
    primaryColor: '#D6001C',
  },
});

const ViewReturningRequest = () => {
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState([]);

  const [stateFilterLabel, setStateFilterLabel] = useState('State');

  const [stateFilter, setStateFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [returnedDateFilter, setReturnedDateFilter] = useState('');

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({});
  const [acceptModalData, setAcceptModalData] = useState({});
  const [page, setPage] = useState(1);
  const [detailModalData, setDetailModalData] = useState({
    requestId: '',
    requestBy: '',
    assignBy: '',
    assignDateString: '',
    returnDate: '',
    acceptBy: '',
    state: ' ',
    assetCode: '',
    assetName: '',
  });
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
        requestId: e.requestId,
        requestBy: e.requestBy,
        assetCode: e.assetCode,
        assetName: e.assetName,
        assignBy: e.assignBy,
        returnDate: e.returnDate,
        assignDateString: e.assignDateString,
        acceptBy: e.acceptBy,
        state: formatState(e.state),
      });
    });
    setDataSource(dataList);
  };
  const getDefaultList = () => {
    RequestService.getReturnDefault()
      .then(response => {
        setDataList(response.data);
      })
      .catch(error => {
        setDataSource([]);
      });
  };

  const getListByFilterAndSearch = (stateFilter, returnedDateFilter, searchText) => {
    RequestService.getListBySearchKey(stateFilter, returnedDateFilter, searchText)
      .then(response => {
        setDataList(response.data);
      })
      .catch(error => {
        console.error(error);
        setDataSource([]);
      });
  };

  useEffect(() => {
    getDefaultList();
  }, []);

  const showDetailModal = data => {
    RequestService.getByID(data.requestId).then(response => {
      setDetailModalData(response.data);
    });
    setIsDetailModalVisible(true);
  };
  const showDeleteModal = data => {
    setIsDeleteModalVisible(true);
    setDeleteModalData(data);
  };

  const showAcceptModal = data => {
    setIsAcceptModalVisible(true);
    setAcceptModalData(data);
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
    if (isAcceptModalVisible) {
      setIsAcceptModalVisible(false);
      return;
    }
  };

  const handleDeleteModalOK = () => {};

  const handleAcceptModalOK = () => {
    instance
      .put(
        END_POINT.acceptReturnRequest + '/' + acceptModalData.requestId,
        {
          data: {},
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
      .then(() => {
        window.location.reload();
        showSuccessMessage('Accept return request successfully.');
      })
      .catch(err => {
        showErrorMessage('Error: ' + err.message);
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
      1: 'Waiting For Returning',
      2: 'Completed',
    };
    const stateValue = {
      1: 'WAITING_FOR_RETURNING',
      2: 'COMPLETED',
    };
    setStateFilterLabel(stateMap[selected]);
    setStateFilter(stateValue[selected]);
  };

  const handleReturnedDate = event => {
    if (event) {
      setReturnedDateFilter(event.format('yyyy-MM-DD'));
    } else {
      setReturnedDateFilter('');
    }
  };

  const handleSearch = value => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (specialChars.test(value)) {
      message.error('Keyword should not contain special characters');
    } else {
      setSearchText(value);
    }
  };

  useEffect(() => {
    if (!stateFilter && !returnedDateFilter && !searchText) {
      getDefaultList();
      return;
    }
    if (stateFilter && !returnedDateFilter) {
      getListByFilterAndSearch(stateFilter, '', searchText);
      return;
    }
    if (!stateFilter && returnedDateFilter) {
      getListByFilterAndSearch('', returnedDateFilter, searchText);
      return;
    }
    if (!stateFilter && !returnedDateFilter) {
      getListByFilterAndSearch('', '', searchText);
      return;
    }
    if (stateFilter && returnedDateFilter) {
      getListByFilterAndSearch(stateFilter, returnedDateFilter, searchText);
      return;
    }
  }, [stateFilter, returnedDateFilter, searchText]);

  const stateFilterMenu = <FilterMenu handleFilter={handleStateFilter} menuList={stateList} />;

  return (
    <div>
      <div style={{ display: 'block', width: '1000px', marginRight: 10 }}>
        <Row justify="start" align="middle">
          <h2 className="title">Request List</h2>
        </Row>
        <Row align="middle" className="utility_bar">
          <Col span={4}>
            <Dropdown.Button overlay={stateFilterMenu} placement="bottom" icon={<FilterFilled />}>
              {stateFilterLabel}
            </Dropdown.Button>
          </Col>
          <Col span={3} style={{ marginLeft: '50px' }}>
            <DatePicker
              disabledDate={d => !d || d.isAfter(new Date()) || d.isSameOrBefore('1900/01/02')}
              placeholder="Returned Date"
              inputReadOnly={true}
              onChange={handleReturnedDate}
              placement="bottom"
            />
          </Col>
          <Col span={5} style={{ marginLeft: '150px' }}>
            <Search
              className="search"
              style={{ width: '250px' }}
              maxLength={50}
              onSearch={handleSearch}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              columns={configTableColumns(
                showDetailModal,
                showDeleteModal,
                navigate,
                showAcceptModal
              )}
              dataSource={dataSource}
              pagination={{
                defaultPageSize: 10,
                hideOnSinglePage: true,
                current: page,
                onChange: page => {
                  setPage(page);
                },
              }}
              rowKey="requestid"
            />
            <DetailModal
              isDetailModalVisible={isDetailModalVisible}
              handleCancel={handleCancel}
              requestId={detailModalData.requestId}
              requestBy={detailModalData.requestBy}
              assetCode={detailModalData.assetCode}
              assetName={detailModalData.assetName}
              returnDate={detailModalData.returnDate}
              assignBy={detailModalData.assignBy}
              acceptBy={detailModalData.acceptBy}
              assignDateString={detailModalData.assignDateString}
              state={formatState(detailModalData.state)}
            />
            <Modal
              title="Are you sure ?"
              visible={isAcceptModalVisible}
              onCancel={handleCancel}
              onOk={handleAcceptModalOK}
              closable={false}
              width={420}
              okText="Yes"
              cancelText="No"
            >
              <p>Do you want to mark this returning request as 'Completed'?</p>
            </Modal>
            <Modal
              title="Are you sure ?"
              visible={isDeleteModalVisible}
              onCancel={handleCancel}
              onOk={handleDeleteModalOK}
              closable={false}
              width={420}
            >
              <p>Do you want to delete this request {deleteModalData.requestId}</p>
            </Modal>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ViewReturningRequest;
