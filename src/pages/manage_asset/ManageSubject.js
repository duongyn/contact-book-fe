import React, { useEffect } from 'react';
import './ManageSubject.css';
import { Table, Modal, Input, Dropdown, Empty } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import 'antd/dist/antd.variable.min.css';
import { FilterFilled } from '@ant-design/icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AssetService from '../../services/subjectService';
import CategoryService from '../../services/categoryService';
import configTableColumns from './page_settings/tableColumns';
import { stateList } from './page_settings/stateFilterMenuData';
import DetailModal from './components/DetailModal';
import FilterMenu from './components/FilterMenu';
import useFilterSearch from './hooks/useFilterSearch';
import instance from '../../httpClient/axiosInstance';
import { toast } from 'react-toastify';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import authHeader from '../../services/AuthHeader';

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
  const [categoriesList, setCategoriesList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [customizeEmpty, setCustomizeEmpty] = useState(false);

  const [stateFilterLabel, setStateFilterLabel] = useState('State');
  const [categoryFilterLabel, setCategoryFilterLabel] = useState('Category');

  const [stateFilter, setStateFilter] = useState(' ');
  const [categoryFilter, setCategoryFilter] = useState(' ');
  const [searchText, setSearchText] = useState(' ');

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isWarnModalVisible, setIsWarnModalVisible] = useState(false);
  const [isWaitingModalVisible, setIsWaitingModalVisible] = useState(false);
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
    AssetService.getAll()
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
    AssetService.getAll()
      .then(response => {
        localStorage.removeItem('nonDefaultList');
        localStorage.setItem('nonDefaultList', JSON.stringify(response.data));
        setLoading(true);
      })
      .catch(error => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // CategoryService.getAll()
    //   .then(response => {
    //     let categories = [];
    //     response.data.map(item => {
    //       categories.push({
    //         label: item.categoryName,
    //         key: item.categoryId,
    //       });
    //     });
    //     categories.push({ type: 'divider' });
    //     categories.push({
    //       label: 'Clear filter',
    //       key: 'clear',
    //     });
    //     setLoading(true);
    //     setCategoriesList(categories);
    //   })
    //   .catch(() => {
    //     setLoading(false);
    //   });
  }, []);

  //reload data when filter and search recognized
  useFilterSearch(
    stateFilter,
    categoryFilter,
    searchText,
    searchValue,
    deleteSuccess,
    setSearchValue,
    setDataSource,
    setCustomizeEmpty
  );

  const showDetailModal = data => {
    AssetService.getByID(data.subjectId).then(response => {
      setDetailModalData(response.data);
    });
    setIsDetailModalVisible(true);
  };

  const showDeleteModal = async data => {
    try {
      const assetHasHistoricalAssign = await AssetService.hasHistoricalAssigns(data.assetCode);
      const assetHasWaitingAssign = await AssetService.hasWaitingAssigns(data.assetCode);
      if (assetHasHistoricalAssign.data) {
        setIsWarnModalVisible(true);
        return;
      } else if (assetHasWaitingAssign.data) {
        setIsWaitingModalVisible(true);
        return;
      } else {
        setIsDeleteModalVisible(true);
        setDeleteModalData(data);
        return;
      }
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
    if (isWarnModalVisible) {
      setIsWarnModalVisible(false);
      return;
    }
    if (isWaitingModalVisible) {
      setIsWaitingModalVisible(false);
      return;
    }
  };

  const handleDeleteModalOK = async () => {
    try {
      const respone = await instance.delete(`/assets/${deleteModalData.assetCode}`, {
        headers: authHeader(),
      });
      showSuccessMessage('Delete asset success!');
      setIsDeleteModalVisible(false);
      setDeleteSuccess(true);
    } catch (error) {
      showErrorMessage('Error: ' + error.response.data);
      setIsDeleteModalVisible(false);
    }
    return;
  };

  const handleStateFilter = event => {
    const selected = Number.isInteger(event.key) ? parseInt(event.key) : event.key;
    if (selected === 'clear') {
      setStateFilterLabel('State');
      setStateFilter(' ');
      return;
    }
    const stateMap = {
      1: 'Available',
      2: 'Not Available',
      3: 'Assigned',
      4: 'Waiting for recycling',
      5: 'Recycled',
    };
    const selectedState = stateMap[selected];
    setStateFilterLabel(selectedState);
    setStateFilter(selectedState);
  };

  const handleCategoryFilter = event => {
    const selected = Number.isInteger(event.key) ? parseInt(event.key) : event.key;
    if (selected === 'clear') {
      setCategoryFilterLabel('Category');
      setCategoryFilter(' ');
      return;
    }
    const categoryMap = {};
    categoriesList.map(item => {
      categoryMap[item.key] = item.label;
    });
    const selectedCategory = categoryMap[selected];
    setCategoryFilterLabel(selectedCategory);
    setCategoryFilter(selectedCategory);
  };

  const handleSearch = value => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (stateFilter || categoryFilter) {
      if (value.trim().length <= 50 && !specialChars.test(value)) {
        setSearchText(value.trim());
        setSearchValue('do-search');
      }
    } else {
      if (value.trim().length > 0 && value.trim().length <= 50 && !specialChars.test(value)) {
        setSearchText(value.trim());
        setSearchValue('do-search');
      }
    }
  };

  const stateFilterMenu = <FilterMenu handleFilter={handleStateFilter} menuList={stateList} />;

  const categoryFilterMenu = (
    <FilterMenu handleFilter={handleCategoryFilter} menuList={categoriesList} />
  );

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
    <div className="asset__list" style={{ display: 'block', width: '1300px' }}>
      <ConfigProvider renderEmpty={customizeEmpty ? customizeRenderEmpty : undefined}>
        <Row justify="start" align="middle">
          <h2 className="title">Subject List</h2>
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
              Create Subject
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
              title="Are you sure ?"
              visible={isDeleteModalVisible}
              onCancel={handleCancel}
              onOk={handleDeleteModalOK}
              okText="Delete"
              closable={false}
              width={420}
            >
              <p>Do you want to delete this asset {deleteModalData.assetCode}</p>
            </Modal>
            <Modal
              visible={isWarnModalVisible}
              onCancel={handleCancel}
              title="Cannot Delete Asset"
              footer={null}
            >
              <p>
                Cannot delete the asset because it belongs to one or more historical assignments.
              </p>
              <br></br>
              <p>If the asset is not able to be used anymore, please update its state in </p>
              <Link to="/asset/edit">Edit Asset Page</Link>
            </Modal>
            <Modal
              visible={isWaitingModalVisible}
              onCancel={handleCancel}
              title="Cannot Delete Asset"
              footer={null}
            >
              <p>
                Cannot delete the asset because it is having waiting for acceptance assignments.
              </p>
            </Modal>
          </Col>
        </Row>
      </ConfigProvider>
    </div>
  );
};

export default ManageAsset;
