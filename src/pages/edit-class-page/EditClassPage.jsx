import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClassService from '../../services/classService';
import './editassignment.css';
import useAuth from '../../hooks/useAuth';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import instance from '../../httpClient/axiosInstance';
import authHeader from '../../services/AuthHeader';
import DetailModal from './TeacherModal';
import axios from 'axios';

const EditClassPage = () => {
  const currentUser = useAuth().user.sub;

  const initialSubjectState = {
    id: 0,
    className: ' ',
    classGrade: ' ',
    formTeacherCode: ' ',
    updatedBy: currentUser,
  };

  let navigate = useNavigate();
  const [editClass, setEditClass] = useState(initialSubjectState);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [teacherListData, setTeacherListData] = useState({
    userCode: '',
    fullName: '',
    username: '',
    roleName: '',
    gender: '',
  });
  const [selectedUserRow, setSelectedUserRow] = useState({});
  const params = useParams();
  const classId = params.classid;

  useEffect(() => {
    if (classId) {
      ClassService.getByID(classId)
        .then(response => {
          setEditClass(response.data);
        })
        .catch(e => {
          showErrorMessage('Error: ' + e.response.data);
          setTimeout(() => {
            navigate('/class');
          }, 3000);
          console.error(e.response.data);
        });
    }
  }, [classId]);

  const [touched, setTouched] = useState({
    className: false,
    classGrade: false,
    formTeacherCode: false
  });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setEditClass({ ...editClass, [name]: value });
    console.log({ name, value });
  };

  const handleBlur = evt => {
    setTouched({
      ...touched,
      [evt.target.name]: true,
    });
  };

  const getDataList = list => {
    let usersList = [];
    list.map(e => {
      usersList.push({
        userCode: e.userCode,
        fullName: e.firstName + ' ' + e.lastName,
        username: e.username,
        roleName: e.roleName,
        gender: e.gender,
      });
    });
    setTeacherListData(usersList);
  };

  const showDetailModal = async data => {
    await ClassService.getValidTeachers().then(response => {
      getDataList(response.data);

    });
    setIsDetailModalVisible(true);
  };

  const handleCancel = () => {
    if (isDetailModalVisible) {
      setIsDetailModalVisible(false);
      setSelectedUserRow({});
      return;
    }
  };

  const handleOk = () => {
    setEditClass({ ...editClass, formTeacherCode: selectedUserRow.userCode })
    setIsDetailModalVisible(false);
  }

  const editClassSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
      await axios.put('http://localhost:8080/classes/add-student-excel/' + editClass.id,
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }).then(response => {
          showSuccessMessage(`Add student success!`);
        }).catch(error => {
          if(error.response.data){
            showErrorMessage(error.response.data);
          }
          else{
            showErrorMessage(error);
          }
        });
    }

    await instance
      .put('/classes/add-teacher', editClass, { headers: authHeader() })
      .then(response => {
        showSuccessMessage(`Edit class success!`);
        setTimeout(() => {
          navigate('/class');
        }, 2000);
      })
      .catch(e => {
        showErrorMessage('Error: ' + e.response.data);
        console.error(e);
      });
  };

  const formValid = true;

  const onCancel = () => {
    setEditClass(initialSubjectState);
    navigate('/class');
  };

  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);

  };

  return (
    <div className="container mt-5" style={{ marginLeft: '180px', width: '500px' }}>
      <h1 style={{ color: '#D6001C', marginBottom: '50px' }}>Chỉnh sửa lớp học</h1>
      <Form onSubmit={editClassSubmit} validated={false}>
        <Form.Group className="mb-3">
          <Form.Label> Tên lớp </Form.Label>
          <Form.Control name="className" value={editClass.className} onChange={handleInputChange} type="text" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Khối</Form.Label>
          <Form.Control name="classGrade" value={editClass.classGrade} onChange={handleInputChange} type="text" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Giáo viên</Form.Label>
          <Form.Control readOnly name="formTeacherCode" value={editClass.formTeacherCode != null ? editClass.formTeacherCode : ''} type="text" onClick={showDetailModal} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>DS học sinh</Form.Label>
          <Form.Control readOnly name="studentList" type="file" onChange={onFileChange} />
        </Form.Group>

        <Button
          style={{ marginLeft: '240px' }}
          disabled={!formValid}
          variant="danger"
          type="submit"
        >
          Lưu
        </Button>
        <Button
          style={{ float: 'right', marginRight: '80px' }}
          variant="light"
          onClick={onCancel}
          className="btn btn-outline-secondary"
          type="button"
        >
          Hủy bỏ
        </Button>
        <DetailModal
          isDetailModalVisible={isDetailModalVisible}
          handleCancel={handleCancel}
          dataList={teacherListData}
          handleOk={handleOk}
          setSelectedRow={setSelectedUserRow}
        />
      </Form>
    </div>
  );
};

export default EditClassPage;
