import { SearchOutlined } from '@ant-design/icons';
import { DatePicker, Input } from 'antd';
import dateformat from 'dateformat';
import { useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth';
import AssetService from '../../services/subjectService';
import AssignmentService from '../../services/assignmentService';
import UserService from '../../services/userService';
import { convertStringToAssignmentDateStringFormat, DATE_FORMAT } from '../../util/dateformat';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import AssetModalComponent from './components/AssetModalComponent';
import UserModalComponent from './components/UserModalComponent';
import './createassignmentpage.css';

const { Search, TextArea } = Input;

function CreateAssignmentPage() {
  const currentDateString = dateformat(new Date(), DATE_FORMAT.createAssignment).toString();
  const disabledDate = current =>
    current.isBefore(moment(currentDateString, 'DD/M/YYYY').startOf('day'));

  let navigate = useNavigate();
  const { user } = useAuth();

  const [isUserModalVisible, setUserModalVisible] = useState(false);
  const [isAssetModalVisible, setAssetModalVisible] = useState(false);

  const [userData, setUserData] = useState([]);
  const [assetData, setAssetData] = useState([]);

  const [userSearchCondition, setUserSearchCondition] = useState('');
  const [assetSearchCondition, setAssetSearchCondition] = useState('');

  const [selectedUserRow, setSelectedUserRow] = useState({});
  const [selectedAssetRow, setSelectedAssetRow] = useState({});

  const showUserData = userData.filter(
    user =>
      user.staffCode.toLowerCase().includes(userSearchCondition.toLowerCase()) ||
      user.fullName.toLowerCase().includes(userSearchCondition.toLowerCase())
  );
  const showAssetData = assetData.filter(
    asset =>
      asset.assetCode.toLowerCase().includes(assetSearchCondition.toLowerCase()) ||
      asset.name.toLowerCase().includes(assetSearchCondition.toLowerCase())
  );

  const formik = useFormik({
    initialValues: {
      nameClass: '',
      classGrade: ''
    },
    onSubmit: values => {
      
      // let assignment = {
      //   assignTo: selectedUserRow.staffCode,
      //   assignBy: user.sub,
      //   assignDateString: convertStringToAssignmentDateStringFormat(values.assignedDate),
      //   assetCode: selectedAssetRow.assetCode,
      //   note: values.note.trim(),
      //   state: 'WAITING_FOR_ACCEPTANCE',
      // };

      let newClass = {
        className: values.nameClass,
        classGrade: values.classGrade
      }

      handleSubmitClass(newClass);
    }
  });

  useEffect(() => {
    // async function fetchData() {
    //   let userResponse = null;
    //   let assetResponse = null;
    //   try {
    //     userResponse = await UserService.getUsersInAdminLocation(user.sub);
    //     assetResponse = await AssetService.getValidAssetsForAssignment();
    //   } catch (error) {
    //     if (error.response.status === 400 || error.response.status === 401) {
    //       showErrorMessage('Your session has expired');
    //       localStorage.removeItem('token');
    //       navigate('/login');
    //     }
    //   }

    //   let returnedUsers = userResponse.data.map(user => {
    //     return {
    //       key: user.staffCode,
    //       staffCode: user.staffCode,
    //       fullName: user.lastName + ' ' + user.firstName,
    //       type: user.type,
    //     };
    //   });

    //   let returnedAssets = assetResponse.data.map(asset => {
    //     return {
    //       key: asset.code,
    //       assetCode: asset.code,
    //       name: asset.assetName,
    //       category: asset.categoryName,
    //     };
    //   });
    //   setUserData(returnedUsers);
    //   setAssetData(returnedAssets);
    // }
    // fetchData();
  }, []);

  const handleUserIconClick = event => {
    setUserModalVisible(true);
  };

  const handleUserOk = event => {
    formik.setFieldTouched('user', true, true);
    formik.setFieldValue('user', selectedUserRow.fullName, true);
    setUserModalVisible(false);
  };

  const handleUserCancel = event => {
    setUserModalVisible(false);
  };

  const handleSearchUserModal = (value, event) => {
    setUserSearchCondition(value.trim());
  };

  const handleAssetIconClick = event => {
    setAssetModalVisible(true);
  };
  const handleAssetOk = () => {
    formik.setFieldTouched('teacher', true, true);
    formik.setFieldValue('teacher', selectedAssetRow.name, true);
    setAssetModalVisible(false);
  };

  const handleAssetCancel = event => {
    setAssetModalVisible(false);
  };

  const handleSearchAssetModal = value => {
    setAssetSearchCondition(value.trim());
  };

  const handleBack = event => {
    navigate('/class');
  };

  const handleClickDate = (date, dateString) => {
    formik.setFieldValue('assignedDate', dateString);
  };

  const handleUserClose = () => {
    let input = document.getElementById('userId');
    input.blur();
    setUserSearchCondition('');
  };
  const handleAssetClose = () => {
    let input = document.getElementById('assetId');
    input.blur();
    setAssetSearchCondition('');
  };

  const handleSubmit = async assignment => {
    try {
      let response = await AssignmentService.createNewAssignment(assignment);
      showSuccessMessage('Assignemnt created successfully');
      navigate('/class', {
        state: { createdAssignment: response.data, prePath: '/class/create' },
      });
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 401) {
        showErrorMessage('Your session has expired');
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleSubmitClass = async newClass => {
    try {
      let response = await AssignmentService.createNewAssignment(newClass);
      showSuccessMessage('Class created successfully');
      navigate('/class');
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 401) {
        showErrorMessage('Your session has expired');
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  return (
    <>
      <UserModalComponent
        visible={isUserModalVisible}
        handleUserOk={handleUserOk}
        handleUserCancel={handleUserCancel}
        handleSearchUserModal={handleSearchUserModal}
        setSelectedRow={setSelectedUserRow}
        showUserData={showUserData}
        afterClose={handleUserClose}
      />
      <AssetModalComponent
        visible={isAssetModalVisible}
        handleAssetOk={handleAssetOk}
        handleAssetCancel={handleAssetCancel}
        handleSearchAssetModal={handleSearchAssetModal}
        setSelectedRow={setSelectedAssetRow}
        showAssetData={showAssetData}
        afterClose={handleAssetClose}
      />
      <div className="assignment-page">
        <p
          style={{
            fontSize: '20px',
            color: 'rgb(171, 42, 22)',
            fontWeight: '600',
          }}
        >
          T???o l???p h???c m???i
        </p>
        <form className="form-custom" onSubmit={(e) => {e.preventDefault(); formik.handleSubmit();}}>
        <div className="wrapper-custom">
            <div className="form-group-container-custom">
              <span style={{ paddingTop: '10px', fontSize: '18px' }}>T??n l???p h???c</span>
              <div className="form-group-custom">
                <Input
                  id="nameClass"
                  name="nameClass"
                  value={formik.values.nameClass}
                  type="text"
                  size="large"
                  {...formik.getFieldProps('nameClass')}
                />
              </div>
            </div>
          </div>
          <div className="wrapper-custom">
            <div className="form-group-container-custom">
              <span style={{ paddingTop: '10px', fontSize: '18px' }}>Kh???i l???p h???c</span>
              <div className="form-group-custom">
                <Input
                  id="className"
                  name="className"
                  value={formik.values.classGrade}
                  type="text"
                  size="large"
                  {...formik.getFieldProps('classGrade')}
                />
              </div>
            </div>
          </div>
          {/* <div className="wrapper-custom">
            <div className="form-group-container-custom">
              <span style={{ paddingTop: '10px', fontSize: '18px' }}>Teacher</span>
              <div className="form-group-custom">
                <Input
                  id="userId"
                  name="user"
                  value={formik.values.user}
                  type="text"
                  size="large"
                  readOnly
                  {...formik.getFieldProps('user')}
                  className={
                    formik.errors.user && formik.touched.user
                      ? 'text-input error form-control'
                      : 'text-input form-control'
                  }
                  onClick={handleUserIconClick}
                />
                <label className="user-search-icon" htmlFor="userId">
                  <SearchOutlined />
                </label>
              </div>
            </div>

            {formik.touched.user && formik.errors.user ? (
              <div className="warning">{formik.errors.user}</div>
            ) : null}
          </div>
          <div className="wrapper-custom">
            <div className="form-group-container-custom">
              <span style={{ paddingTop: '10px', fontSize: '18px' }}>Asset</span>
              <div className="form-group-custom">
                <Input
                  id="assetId"
                  name="asset"
                  value={formik.values.asset}
                  type="text"
                  size="large"
                  readOnly
                  {...formik.getFieldProps('asset')}
                  className={
                    formik.errors.asset && formik.touched.asset
                      ? 'text-input error form-control'
                      : 'text-input form-control'
                  }
                  onClick={handleAssetIconClick}
                />
                <label className="user-search-icon" htmlFor="assetId">
                  <SearchOutlined />
                </label>
              </div>
            </div>
            {formik.touched.teacher && formik.errors.teacher ? (
              <div className="warning">{formik.errors.teacher}</div>
            ) : null}
          </div> */}
          <div className="align-button-right">
            <button
              // disabled={formik.errors.user || formik.errors.teacher}
              type="submit"
              className="btn btn-danger"
              style={{ marginRight: '30px' }}
            >
              Save
            </button>
            <button className="btn btn-light btn-light-custom" onClick={handleBack}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateAssignmentPage;
