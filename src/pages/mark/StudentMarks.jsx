import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateSchedule.css';
import useAuth from '../../hooks/useAuth';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import { Table, Tooltip, Space, Button as AnButton } from 'antd';
import MarkService from '../../services/markService';
import { Col } from 'antd';
import { Link } from 'react-router-dom';
import {
  EditFilled
} from '@ant-design/icons';


const StudentMark = () => {

  const currentUser = useAuth().user.sub;

  let navigate = useNavigate();
  const [newSubject, setNewSubject] = useState({});
  const params = useParams();
  const classId = params.id;
  const userCode = params.code;
  const [markList, setMarkList] = useState([]);
  const [semesterValue, setSemesterValue] = useState('1');

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (userCode) {
      MarkService.getByStudent(userCode)
        .then(response => {
          let list = [];
          response.data.filter(el => el.semester.includes(semesterValue)).forEach(el => {
            let markEl = {
              markId: el.markId,
              halfMark: el.halfMark,
              semesterMark: el.semesterMark,
              finalMark: el.finalMark,
              halfFeedback: el.halfFeedback,
              semesterFeedback: el.semesterFeedback,
              studentCode: el.studentCode,
              teacherCode: el.teacherCode,
              markSubjectId: el.markSubjectId,
              subjectName: el.subjectName,
              teacherName: el.teacherName,
              studentName: el.studentName,
              semester: el.semester
            }
            list.push(markEl);
          });
          setMarkList(list);
        })
        .catch(e => {
          showErrorMessage('Error: ' + e);
          setTimeout(() => {
            navigate('/mark');
          }, 3000);
          console.error(e);
        });
    }
  }, [userCode, semesterValue]);

  const handleChange = event => {
    const { name, value } = event.target;
    setSemesterValue(value);
  };

  const navigateToStudentMark = code => {
    //navigate(`/mark/my-class/${code.userCode}`);
  }

  const onCancel = () => {
    setNewSubject({});
    navigate(`/mark`);
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
      width: 200,
      dataIndex: 'studentCode',
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
      title: <div style={{ padding: '0px 0px 0px 0px' }}>Tên học sinh</div>,
      width: 200,
      dataIndex: 'studentName',
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
      title: 'Điểm giữa kì',
      dataIndex: 'halfMark',
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
      title: 'Đánh giá GK',
      dataIndex: 'halfFeedback',
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
      title: <div style={{ padding: '0px 0px 0px 0px' }}>Điểm Học kì</div>,
      dataIndex: 'semesterMark',
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
      title: 'Đánh giá cuối kì',
      dataIndex: 'semesterFeedback',
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
    },
    {
      title: '',
      render: record => (
        <Space size="small">
          <Tooltip title="edit">
            <Link to={{ pathname: '/mark/my-class/'+ userCode + '/edit/' + record.markId }}>
            <AnButton type="text" icon={<EditFilled />} />
            </Link>
          </Tooltip>
        </Space>
      ),
    }
  ];

  return (
    <div className="container mt-5" style={{ marginLeft: '50px', width: '1000px', fontSize: '14pt' }}>
      <h1 style={{ color: '#D6001C', marginBottom: '10px' }}>Danh sách điểm</h1>
      <Form.Group className="mb-3">
        <Form.Label className="mr-2">Học kì</Form.Label>
        <Form.Select
          size="lg"
          aria-label=""
          name="role"
          onChange={handleChange}
        >
          <option value=""></option>
          <option value="1">I</option>
          <option value="2">II</option>
        </Form.Select>
      </Form.Group>
      <Col span={5} push={18} style={{ marginBottom: '50px' }}>
        <Link to={{ pathname: '/mark/my-class/' + userCode + '/create' }}>
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
        rowKey="subjectName"
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
