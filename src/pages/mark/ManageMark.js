import React, { useEffect } from 'react';
import './ManageMark.css';
import { Table, Modal, Input, Empty } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import 'antd/dist/antd.variable.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import configTableColumns from './page_settings/tableColumns';
import useFilterSearch from './hooks/useFilterSearch';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import useAuth from '../../hooks/useAuth';
import UserService from '../../services/userService';
import ClassService from '../../services/classService';


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

const ManageMark = () => {
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState([]);

  const [loading, setLoading] = useState(false);

  const [customizeEmpty, setCustomizeEmpty] = useState(false);

  const [searchText, setSearchText] = useState(' ');
  
  const [keyValid, setKeyValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const currentUser = useAuth().user.userCode;

  const [detailModalData, setDetailModalData] = useState({
    id: 0,
    className: ' ',
    classGrade: ' ',
    formTeacherCode: ''
  });

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
      if (u.userCode == code) {
        fullName = u.firstName + ' ' + u.lastName;
      }
    });
    return fullName;
  }

  const setDataList = list => {
    let dataList = [];
    list.map(e => {
      if (e.formTeacherCode == currentUser) {
        dataList.push({
          id: e.id,
          className: e.className,
          classGrade: e.classGrade,
          formTeacherCode: getUserFullName(e.formTeacherCode),
          listStudentCode: e.listStudentCode,
        });
      }
    });
    setDataSource(dataList);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setDataList(listClass);
  }, [listClass]);

  //reload data when filter and search recognized
  useFilterSearch(
    searchText,
    searchValue,
    deleteSuccess,
    setSearchValue,
    setDataSource,
    setCustomizeEmpty
  );

  const navigateToClass = data => {
    navigate(`/mark/my-class/${data.id}`, { state: { id: data.id } });
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
          <h2 className="title">Danh sách lớp học của bạn</h2>
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
        <Row justify="center" className="asset_table">
          <Col span={24}>
            <Table
              rowKey="id"
              pagination={{
                pageSize: 10,
                hideOnSinglePage: true,
                itemRender: itemRender,
              }}
              columns={configTableColumns(
                navigateToClass
              )}
              dataSource={dataSource}
            />
          </Col>
        </Row>
      </ConfigProvider>
    </div>
  );
};

export default ManageMark;
