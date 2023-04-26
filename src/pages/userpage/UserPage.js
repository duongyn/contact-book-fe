import { useState, useEffect } from 'react';
import { Table, Modal, Space, Tooltip, message, Dropdown } from 'antd';
import 'antd/dist/antd.min.css';
import './userPage.css';
import { END_POINT } from '../../httpClient/config';
import { Col, Row } from 'antd';
import { Select, Button } from 'antd';
import useAuth from '../../hooks/useAuth';
import { Input } from 'antd';
import { checkUser, disableUser } from '../../services/index';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import instance from '../../httpClient/axiosInstance';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  EditFilled,
  CloseCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { FilterFilled } from '@ant-design/icons';
import { typeList } from './typeList';
import FilterMenu from './FilterMenu';
import { Form } from 'react-bootstrap';
import axios from 'axios';

const { Option } = Select;
const itemRender = (_, type, originalElement) => {
  if (type === 'prev') {
    return <a>Previous</a>;
  }
  if (type === 'next') {
    return <a>Next</a>;
  }
  return originalElement;
};

const UserPage = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({});
  const [isCheckModalVisible, setIsCheckModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [condition, setCondition] = useState({
    filter: '',
    search: '',
  });
  const [detail, setDetail] = useState({
    userCode: null,
    lastName: null,
    username: null,
    joinedDate: null,
    type: null,
  });
  const [keyValid, setKeyValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const currentUser = useAuth().user.sub;
  const [typeFilterLabel, setTypeFilterLabel] = useState('Type');
  const [selectedFile, setSelectedFile] = useState();
  const [showUploadModal, setShowUploadModal] = useState(false);
  let usersList = [];
  const columns = [
    {
      title: 'ID người dùng',
      dataIndex: 'userCode',
      sorter: (a, b) => a.userCode.toLowerCase().localeCompare(b.userCode.toLowerCase()),
      ellipsis: true,
      onCell: record => {
        return {
          onClick: () => {
            showModal(record);
          },
        };
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'fullname',
      sorter: (a, b) => a.fullname.toLowerCase().localeCompare(b.fullname.toLowerCase()),
      ellipsis: true,
      onCell: record => {
        return {
          onClick: () => {
            showModal(record);
          },
        };
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      onCell: record => {
        return {
          onClick: () => {
            showModal(record);
          },
        };
      },
      sorter: (a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()),
      ellipsis: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Ngày tháng sinh',
      dataIndex: 'dob',
      sorter: (a, b) => a.dob.toLowerCase().localeCompare(b.dob.toLowerCase()),
      ellipsis: true,
      onCell: record => {
        return {
          onClick: () => {
            showModal(record);
          },
        };
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Vai trò',
      dataIndex: 'type',
      sorter: (a, b) => a.type[0].toLowerCase().localeCompare(b.type[0].toLowerCase()),
      ellipsis: true,
      onCell: record => {
        return {
          onClick: () => {
            showModal(record);
          },
        };
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '',
      render: record => (
        <Space size="small">
          <Tooltip title="edit">
            <Link to={{ pathname: '/user/edit/' + record.username }}>
              <Button type="text" icon={<EditFilled />} />
            </Link>
          </Tooltip>
          <Tooltip title="delete">
            <Button
              type="text"
              icon={<CloseCircleOutlined />}
              onClick={() => {
                showDeleteModal(record);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  const { state } = useLocation();
  const getDataList = list => {
    list.map(e => {
      if (e.username != currentUser) {
        usersList.push({
          userCode: e.userCode,
          fullname: e.lastName.concat(' ' + e.firstName),
          username: e.username,
          joinedDate: moment(new Date(e.joinedDate)).format('MM/DD/yyyy'),
          type: e.roleName,
          dob: moment(new Date(e.dob)).format('MM/DD/yyyy'),
          gender: e.gender,
          location: e.address,
        });
      }
    });
    setUsers(usersList);
    setUserSearch(usersList);
  };
  useEffect(() => {
    usersList = [];
    instance
      .get(END_POINT.listUsers)
      .then(response => {
        setLoading(false);
        getDataList(response.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    let userlists = users.filter(u => {
      setPage(1);
      return (
        u.type[0].trim().toLowerCase().includes(condition.filter.trim().toLowerCase()) &&
        (u.username.trim().toLowerCase().includes(condition.search.trim().toLowerCase()) ||
          u.userCode.trim().toLowerCase().includes(condition.search.trim().toLowerCase()))
      );
    });
    setUserSearch(userlists);
    setSearchValue('');
  }, [condition.filter, searchValue]);

  if (loading) {
    return <h1>Loading</h1>;
  }
  const handleTypeFilter = event => {
    const selected = Number.isInteger(event.key) ? parseInt(event.key) : event.key;
    if (selected === 'clear') {
      setTypeFilterLabel('Type');
      setCondition({
        ...condition,
        filter: '',
      });
      return;
    }
    const stateMap = {
      1: 'Admin',
      2: 'Manager',
      3: 'Teacher',
      4: 'Student'
    };
    const stateValue = {
      1: 'ADMIN',
      2: 'MANAGER',
      3: 'TEACHER',
      4: 'STUDENT'
    };
    setTypeFilterLabel(stateMap[selected]);
    setCondition({
      ...condition,
      filter: stateValue[selected],
    });
  };
  const typeFilterMenu = <FilterMenu handleFilter={handleTypeFilter} menuList={typeList} />;
  const showDeleteModal = async data => {
    //let response = await checkUser(data.userCode);
    if (data.userCode) {
      setIsDeleteModalVisible(true);
      setDeleteModalData(data);
    } else {
      setIsCheckModalVisible(true);
    }
  };
  const showModal = r => {
    setIsModalVisible(true);
    setDetail(r);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    if (isModalVisible) {
      setIsModalVisible(false);
      return;
    }
    if (isDeleteModalVisible) {
      setIsDeleteModalVisible(false);
      return;
    }
    if (isCheckModalVisible) {
      setIsCheckModalVisible(false);
      return;
    }
    if(showUploadModal) {
      setShowUploadModal(false);
      return;
    }
  };
  const handleClickSearch = evt => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (evt.trim().length <= 50 && !specialChars.test(evt)) {
      setCondition({
        ...condition,
        search: evt.trim(),
      });
      setSearchValue('do-filter');
    }
  };

  const handleDeleteModalOK = async () => {
    setIsDeleteModalVisible(false);
    disableUser(deleteModalData.userCode).then(response => {
      showSuccessMessage(`Delete user success!`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
      .catch(e => {
        if (e.response.data.message) {
          showErrorMessage('Error: ' + e.response.data.message);
          console.error(e);
        }
        else {
          showErrorMessage('Error: ' + e);
        }
      });
  };

  const handleTrim = evt => {
    setCondition({
      ...condition,
      search: evt.target.value.trim(),
    });
    setSearchValue(evt.target.value.trim());
  };

  const handleKey = evt => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    setCondition({
      ...condition,
      search: evt.target.value,
    });
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

  const handleOkUpload = () => {
    setShowUploadModal(false)
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
      axios.post('http://localhost:8080/users/add-user-excel',
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }).then(response => {
          showSuccessMessage(`Tạo danh sách người dùng thành công`);
          setTimeout(() => {
            window.location.reload();
          }, 2000);

        }).catch(error => {
          if (error.response.data) {
            showErrorMessage("Import thất bại " + error.response.data);
          }
          else {
            showErrorMessage("Import thất bại " + error);
          }
        });
    }
  }

  const onFileChange = evt => {
    setSelectedFile(evt.target.files[0]);
    setShowUploadModal(true)
  }

  return (
    <div style={{ display: 'block', width: '1000px', marginLeft: '50px' }}>
      <Row justify="start" align="middle">
        <h2 className="title">Danh sách người dùng</h2>
      </Row>
      <Row>
        <Form.Group className="mb-3">
          <Form.Label className="mr-5">Import DS Người dùng</Form.Label>
          <Form.Control readOnly name="userList" type="file" onChange={onFileChange} />
        </Form.Group>
      </Row>
      <Row style={{ marginBottom: '50px' }}>
        <Col span={6}>
          <Dropdown.Button overlay={typeFilterMenu} placement="bottom" icon={<FilterFilled />}>
            {typeFilterLabel}
          </Dropdown.Button>
        </Col>
        <Col span={8}>
          <Input.Search
            onSearch={handleClickSearch}
            onChange={handleKey}
            onBlur={handleTrim}
            style={{
              width: '60%',
            }}
            maxLength={51}
            defaultValue=""
            value={condition.search}
          />
          {keyValid && <div style={{ display: 'block', color: 'red' }}>{errorMsg}</div>}
        </Col>
        <Col span={5} push={3}>
          <Link to="/user/create">
            <button type="button" className="create_assign" style={{ width: '190px' }}>
              Tạo mới người dùng
            </button>
          </Link>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={userSearch}
        pagination={{
          defaultPageSize: 10,
          hideOnSinglePage: true,
          itemRender: itemRender,
          current: page,
          onChange: page => {
            setPage(page);
          },
        }}
        rowKey="userCode"
      />
      <Modal
        title="User Detail"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <p>ID: {detail.userCode}</p>
        <p>Họ và tên: {detail.fullname}</p>
        <p>Tên đăng nhập: {detail.username}</p>
        <p>Ngày tháng sinh: {moment(new Date(detail.dob)).format('MM/DD/yyyy')}</p>
        <p>Giới tính: {detail.gender}</p>
        <p>Vai trò: {detail.type}</p>
        <p>Nơi ở: {detail.location}</p>
      </Modal>
      <Modal
        title="Are you sure ?"
        visible={showUploadModal}
        onCancel={handleCancel}
        onOk={handleOkUpload}
        okText="Import"
        closable={false}
        width={420}
      >
        <p>Bạn có muốn import danh sách người dùng này không?</p>
      </Modal>
      <Modal
        title="Are you sure?"
        open={isDeleteModalVisible}
        onCancel={handleCancel}
        onOk={handleDeleteModalOK}
        okText="Disable"
      >
        <p>Are you sure want to disable {deleteModalData.userCode}</p>
      </Modal>
      <Modal
        title="Can not disable user"
        visible={isCheckModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <p>There are valid assignments belonging to this user.</p>
        <p>Please close all assignments before disabling user.</p>
      </Modal>
    </div>
  );
};
export default UserPage;
