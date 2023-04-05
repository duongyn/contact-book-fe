import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateSchedule.css';
import useAuth from '../../hooks/useAuth';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import UserService from '../../services/userService';
import { Table } from 'antd';
import ClassService from '../../services/classService';


const StudentMarkList = () => {

  const currentUser = useAuth().user.sub;

  let navigate = useNavigate();
  const [newSubject, setNewSubject] = useState({});
  const params = useParams();
  const classId = params.id;
  const [page, setPage] = useState(1);

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (classId) {
      ClassService.getByID(classId)
        .then(response => {
          setNewSubject(response.data);
          getAllUserByClass(response.data.className)
        })
        .catch(e => {
          showErrorMessage('Error: ' + e.response.data);
          setTimeout(() => {
            navigate('/mark');
          }, 3000);
          console.error(e.response.data);
        });
    }

  }, [classId]);

  const getAllUserByClass = name => {
    UserService.getAllUsersByClass(name).then(response => {
      setUserList(response.data);
    }
    ).catch(err => {
      console.error(err.response.data);
    });
  }

  const navigateToStudentMark = code => {
    navigate(`/mark/my-class/${classId}/${code.userCode}`);
  }

  const onCancel = () => {
    setNewSubject({});
    navigate('/mark');
  };

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Previous</a>;
    }
    if (type === 'next') {
      return <a>Next</a>;
    }
    return originalElement;
  };

  const tableColumns = [
    {
      title: <div style={{ padding: '0px 0px 0px 0px' }}>Mã HS</div>,
      width: 100,
      dataIndex: 'userCode',
      sorter: {
        compare: (a, b) => {
          const codeA = a.userCode.toUpperCase();
          const codeB = b.userCode.toUpperCase();
          if (codeA < codeB) {
            return -1;
          }
          if (codeA > codeB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: record => {
        return {
          onClick: () => {
            navigateToStudentMark(record);
          },
        };
      },
    },
    {
      title: 'Tên',
      dataIndex: 'firstName',
      width: 300,
      sorter: {
        compare: (a, b) => {
          const codeA = a.firstName.toUpperCase();
          const codeB = b.firstName.toUpperCase();
          if (codeA < codeB) {
            return -1;
          }
          if (codeA > codeB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: record => {
        return {
          onClick: () => {
            navigateToStudentMark(record);
          },
        };
      },
    },
    {
      title: <div style={{ padding: '0px 0px 0px 0px' }}>Họ</div>,
      dataIndex: 'lastName',
      width: 200,
      sorter: {
        compare: (a, b) => {
          const nameA = a.lastName.toUpperCase();
          const nameB = b.lastName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: record => {
        return {
          onClick: () => {
            navigateToStudentMark(record);
          },
        };
      },
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 300,
      sorter: {
        compare: (a, b) => {
          const assignToA = a.username.toUpperCase();
          const assignToB = b.username.toUpperCase();
          if (assignToA < assignToB) {
            return -1;
          }
          if (assignToA > assignToB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: record => {
        return {
          onClick: () => {
            navigateToStudentMark(record);
          },
        };
      },
    }
  ];

  return (
    <div className="container mt-5" style={{ marginLeft: '50px', width: '800px', fontSize: '14pt' }}>
      <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>Danh sách học sinh lớp {(newSubject != undefined) ? newSubject.className : ''}</h1>
      <Table
        columns={tableColumns}
        dataSource={userList}
        pagination={{
          defaultPageSize: 10,
          hideOnSinglePage: true,
          itemRender: itemRender
        }}
        rowKey="userCode"
      />
      <div style={{ marginTop: '100px' }}>
        <Button
          style={{ float: 'right', marginRight: '10px' }}
          variant="light"
          onClick={onCancel}
          className="btn btn-outline-secondary"
          type="button"
        >
          Hủy bỏ
        </Button>
      </div>

    </div>
  );
};

export default StudentMarkList;
