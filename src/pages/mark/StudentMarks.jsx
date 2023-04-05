import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateSchedule.css';
import useAuth from '../../hooks/useAuth';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import UserService from '../../services/userService';
import { Table } from 'antd';
import MarkService from '../../services/markService';
import { Col } from 'antd';
import { Link } from 'react-router-dom';


const StudentMark = () => {

  const currentUser = useAuth().user.sub;

  let navigate = useNavigate();
  const [newSubject, setNewSubject] = useState({});
  const params = useParams();
  const classId = params.id;
  const userCode = params.code;
  const [markList, setMarkList] = useState([]);

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (userCode) {
      MarkService.getByStudent(userCode)
        .then(response => {
          setMarkList(response.data);
        })
        .catch(e => {
          showErrorMessage('Error: ' + e.response.data);
          setTimeout(() => {
            navigate('/mark');
          }, 3000);
          console.error(e.response.data);
        });
    }
  }, [userCode]);

  const getAllUserByClass = name => {
    UserService.getAllUsersByClass(name).then(response => {
      setUserList(response.data);
    }
    ).catch(err => {
      console.error(err.response.data);
    });
  }

  const navigateToStudentMark = code => {
    //navigate(`/mark/my-class/${classId}/${code.userCode}`);
  }

  const onCancel = () => {
    setNewSubject({});
    navigate(`/mark/my-class/${classId}`);
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
      title: <div style={{ padding: '0px 0px 0px 0px' }}>Tên môn học</div>,
      width: 200,
      dataIndex: 'subjectName',
      sorter: {
        compare: (a, b) => {
          const codeA = a.markId.toUpperCase();
          const codeB = b.markId.toUpperCase();
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
      title: 'Loại điểm',
      dataIndex: 'markType',
      width: 300,
      sorter: {
        compare: (a, b) => {
          const codeA = a.markType.toUpperCase();
          const codeB = b.markType.toUpperCase();
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
      title: <div style={{ padding: '0px 0px 0px 0px' }}>Điểm</div>,
      dataIndex: 'markValue',
      width: 200,
      sorter: {
        compare: (a, b) => {
          const nameA = a.markValue.toUpperCase();
          const nameB = b.markValue.toUpperCase();
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
      title: 'Người chấm',
      dataIndex: 'teacherName',
      width: 300,
      sorter: {
        compare: (a, b) => {
          const assignToA = a.teacherName.toUpperCase();
          const assignToB = b.teacherName.toUpperCase();
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
      <h1 style={{ color: '#D6001C', marginBottom: '10px' }}>Danh sách điểm</h1>
      <Col span={5} push={18} style={{ marginBottom: '50px' }}>
          <Link to={{ pathname: '/mark/my-class/' + classId+'/'+userCode+'/create' }}>
            <button type="button" className="create_assign" style={{ width: '190px' }}>
              Tạo mới điểm
            </button>
          </Link>
        </Col>
      <Table
        columns={tableColumns}
        dataSource={markList}
        pagination={{
          defaultPageSize: 10,
          hideOnSinglePage: true,
          itemRender: itemRender
        }}
        rowKey="markId"
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

export default StudentMark;
