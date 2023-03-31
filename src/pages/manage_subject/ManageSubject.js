import React, { useEffect } from 'react';
import './ManageSubject.css';
import { Table, Modal, Input, Empty } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import 'antd/dist/antd.variable.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import SubjectService from '../../services/subjectService';
import configTableColumns from './page_settings/tableColumns';
import DetailModal from './components/DetailModal';
import useFilterSearch from './hooks/useFilterSearch';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';

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

const ManageSubject = () => {
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

  const [detailModalData, setDetailModalData] = useState({
    subjectId: 0,
    subjectName: ' ',
    subjectGrade: '',
  });
  const [deleteModalData, setDeleteModalData] = useState({});

  useEffect(() => {
    SubjectService.getAll()
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
    SubjectService.getAll()
      .then(response => {
        localStorage.removeItem('nonDefaultList');
        localStorage.setItem('nonDefaultList', JSON.stringify(response.data));
        setLoading(true);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  }, []);

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
    SubjectService.getByID(data.subjectId).then(response => {
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
    SubjectService.deleteById(deleteModalData.subjectId).then(response => {
      showSuccessMessage('Delete subject success!');
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

  return (
    <div className="asset__list" style={{ display: 'block', width: '1000px' }}>
      <ConfigProvider renderEmpty={customizeEmpty ? customizeRenderEmpty : undefined}>
        <Row justify="start" align="middle">
          <h2 className="title">Danh sách môn học</h2>
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
          <Col span={3} push={4}>
            <button
              type="button"
              style={{ paddingTop: '6px' }}
              className="create_button"
              onClick={() => {
                navigate('/subject/create');
              }}
            >
              Tạo môn học
            </button>
          </Col>
        </Row>
        <Row justify="center" className="asset_table">
          <Col span={24}>
            <Table
              rowKey="subjectId"
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
              subjectId={detailModalData.subjectId}
              subjectName={detailModalData.subjectName}
              subjectGrade={detailModalData.subjectGrade}
            />
            <Modal
              title="Xóa môn học ?"
              visible={isDeleteModalVisible}
              onCancel={handleCancel}
              onOk={handleDeleteModalOK}
              okText="Delete"
              closable={false}
              width={420}
            >
              <p>Bạn có muốn xóa môn học {deleteModalData.subjectName} {deleteModalData.subjectGrade} không</p>
            </Modal>
          </Col>
        </Row>
      </ConfigProvider>
    </div>
  );
};

export default ManageSubject;
