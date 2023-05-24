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
  const [newList, setNewList] = useState([]);
  const [semesterValue, setSemesterValue] = useState('1');

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (userCode) {
      MarkService.getByStudent(userCode)
        .then(response => {
          let list = [];
          response.data.forEach(el => {
            if (el.markType.includes(semesterValue)) {
              let markEl = {
                markId: el.markId,
                markValue: el.markValue,
                studentCode: el.studentCode,
                teacherCode: el.teacherCode,
                markSubjectId: el.markSubjectId,
                subjectName: el.subjectName,
                teacherName: el.teacherName,
                studentName: el.studentName,
                markType: formatType(el.markType),
                semester: el.semester,
                feedback: el.feedback
              }
              list.push(markEl);
            }
          });
          getNewMarkList(response.data.filter(el => el.markType.includes(semesterValue)));
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

  const formatType = markType => {
    if (markType == "semester1") {
      return "Học kì I";
    }
    if (markType == "halfsemester1") {
      return "Giữa kì I";
    }
    if (markType == "semester2") {
      return "Học kì II";
    }
    if (markType == "halfsemester2") {
      return "Giữa kì II";
    }
    return "";
  }

  const groupBy = (items, key) => {
    return items.reduce(function (acc, item) {
      (acc[item[key]] = acc[item[key]] || []).push(item);
      return acc;
    }, {});
  }

  const getNewMarkList = list => {
    const newList = groupBy(list, 'subjectName')
    let finalList = [];
    Object.keys(newList).map(el => {
      let s1 = 0;
      let half1 = 0;
      let f1 = '';
      let f2 = '';
      newList[el].map(m => {
        if (m.markType == "semester1" || m.markType == "semester2") {
          s1 = m.markValue;
          f1 = m.feedback;
        }
        if (m.markType == "halfsemester1" || m.markType == "halfsemester2") {
          half1 = m.markValue;
          f2 = m.feedback;
        }
      });
      const newMark = {
        half1: half1,
        s1: s1,
        subjectName: newList[el][0].subjectName,
        teacherName: newList[el][0].teacherName,
        studentName: newList[el][0].studentName,
        studentCode: newList[el][0].studentCode,
        feedback1: f1,
        feedback2: f2
      }
      finalList.push(newMark);
    });
    setNewList(finalList);
  }

  const getAllUserByClass = name => {
    UserService.getAllUsersByClass(name).then(response => {
      setUserList(response.data);
    }
    ).catch(err => {
      console.error(err.response.data);
    });
  }
  
  const handleChange = event => {
    const { name, value } = event.target;
    setSemesterValue(value);
  };

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
      title: <div style={{ padding: '0px 0px 0px 0px' }}>Tên môn học</div>,
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
      dataIndex: 'half1',
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
      dataIndex: 'feedback1',
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
      dataIndex: 's1',
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
      dataIndex: 'feedback2',
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
        <Link to={{ pathname: '/mark/my-class/' + classId + '/' + userCode + '/create' }}>
          <button type="button" className="create_assign" style={{ width: '190px' }}>
            Tạo mới điểm
          </button>
        </Link>
      </Col>
      <Table
        columns={tableColumns}
        dataSource={newList}
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
