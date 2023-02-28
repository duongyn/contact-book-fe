import { CaretDownOutlined } from '@ant-design/icons';
import { DatePicker, Input } from 'antd';
import dateformat from 'dateformat';
import { useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth';
import AssetService from '../../services/subjectService';
import AssignmentService from '../../services/assignmentService';
import UserService from '../../services/userService';
import {
  converStringToUpdateAssignmentFormat,
  formatDateStringFromViewAssignment,
} from '../../util/dateformat';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import AssetModalComponent from '../create-assignment-page/components/AssetModalComponent';
import UserModalComponent from '../create-assignment-page/components/UserModalComponent';
import './editassignment.css';

const { Search, TextArea } = Input;

function EditAssignmentPage() {
  const location = useLocation();
  const editAssignment = location.state.editAssignment;

  const [initialUpdateValues, setInitialUpdateValues] = useState({
    user: '',
    asset: '',
    assignedDate: formatDateStringFromViewAssignment(editAssignment.assignDateString),
    note: '',
    createdDate: formatDateStringFromViewAssignment(editAssignment.createdDateString),
  });
  const disableDateValue = initialUpdateValues.createdDate;

  const disabledDate = current =>
    current.isBefore(moment(disableDateValue, 'YYYY-MM-DD').startOf('day'));

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
    initialValues: initialUpdateValues,
    enableReinitialize: true,
    onSubmit: values => {
      let assignment = {
        id: editAssignment.id,
        assignTo: selectedUserRow.staffCode,
        assignBy: user.sub,
        assignDateString: converStringToUpdateAssignmentFormat(values.assignedDate),
        assetCode: selectedAssetRow.assetCode,
        note: values.note.trim(),
      };

      handleSubmit(assignment);
    },
    validationSchema: Yup.object({
      user: Yup.string().required('Required'),
      asset: Yup.string().required('Required'),
    }),
  });

  useEffect(() => {
    async function fetchData() {
      let userResponse = null;
      let assetResponse = null;
      try {
        userResponse = await UserService.getUsersInAdminLocation(user.sub);
        assetResponse = await AssetService.getValidAssetsForUpdateAssignment(
          location.state.editAssignment.id
        );
      } catch (error) {
        if (error.response.status === 400 || error.response.status === 401) {
          showErrorMessage('Your session has expired');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
      let returnedUsers = userResponse.data.map(user => {
        return {
          key: user.staffCode,
          staffCode: user.staffCode,
          fullName: user.lastName + ' ' + user.firstName,
          type: user.type,
        };
      });

      let returnedAssets = assetResponse.data.map(asset => {
        let newAsset = {
          key: asset.code,
          assetCode: asset.code,
          name: asset.assetName,
          category: asset.categoryName,
        };
        return newAsset;
      });

      let updateUser = returnedUsers.filter(user => user.staffCode === editAssignment.assignTo)[0];
      let updateAsset = returnedAssets.filter(
        asset => asset.assetCode === editAssignment.assetCode
      )[0];

      setUserData(returnedUsers);
      setAssetData(returnedAssets);
      setInitialUpdateValues({
        ...initialUpdateValues,
        user: updateUser.fullName,
        asset: updateAsset.name,
        note: editAssignment.note,
      });
      setSelectedUserRow({
        key: updateUser.key,
        staffCode: updateUser.staffCode,
        fullName: updateUser.fullName,
        type: updateUser.type,
      });
      setSelectedAssetRow({
        key: updateAsset.key,
        assetCode: updateAsset.assetCode,
        name: updateAsset.name,
        category: updateAsset.category,
      });
    }
    fetchData();
  }, []);

  const handleUserIconClick = event => {
    setUserModalVisible(true);
  };

  const handleUserOk = event => {
    setUserModalVisible(false);
    formik.setFieldTouched('user', true, true);
    formik.setFieldValue('user', selectedUserRow.fullName, true);
  };

  const handleUserCancel = event => {
    setUserModalVisible(false);
  };

  const handleSearchUserModal = value => {
    setUserSearchCondition(value.trim());
  };

  const handleAssetIconClick = event => {
    setAssetModalVisible(true);
  };
  const handleAssetOk = () => {
    setAssetModalVisible(false);
    formik.setFieldTouched('asset', true, true);
    formik.setFieldValue('asset', selectedAssetRow.name, true);
  };

  const handleAssetCancel = event => {
    setAssetModalVisible(false);
  };

  const handleSearchAssetModal = value => {
    setAssetSearchCondition(value.trim());
  };

  const handleBack = event => {
    navigate('/assignment');
  };

  const handleClickDate = (date, dateString) => {
    var parts = dateString.split('/');

    var mydate = new Date(parts[2], parts[1] - 1, parts[0]);

    formik.setFieldValue(
      'assignedDate',
      dateformat(mydate, 'yyyy-mm-dd HH:MM:ss').toString(),
      true
    );
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
      let response = await AssignmentService.updateAssignment(assignment);
      showSuccessMessage('Assignemnt Updated successfully');
      navigate('/assignment', {
        state: { updatedAssignment: response.data, prePath: '/assignment/edit' },
      });
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
          Edit Assignment
        </p>
        <form className="form-custom" onSubmit={formik.handleSubmit}>
          <div className="wrapper-custom">
            <div className="form-group-container-custom">
              <span style={{ paddingTop: '10px', fontSize: '18px' }}>User</span>
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
                  <CaretDownOutlined />
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
                  <CaretDownOutlined />
                </label>
              </div>
            </div>
            {formik.touched.asset && formik.errors.asset ? (
              <div className="warning">{formik.errors.asset}</div>
            ) : null}
          </div>
          <div className="wrapper-custom">
            <div className="form-group-container-custom">
              <span style={{ paddingTop: '10px', fontSize: '18px' }}>Assigned Date</span>
              <div className="form-group-custom">
                <DatePicker
                  name="assignedDate"
                  format={'DD/M/YYYY'}
                  allowClear={false}
                  disabledDate={disabledDate}
                  onChange={handleClickDate}
                  style={{ width: '100%' }}
                  size="large"
                  inputReadOnly={true}
                  defaultValue={moment(initialUpdateValues.assignedDate, 'YYYY/M/DD')}
                />
              </div>
            </div>
          </div>
          <div className="wrapper-custom">
            <div className="form-group-container-custom">
              <span style={{ paddingTop: '10px', fontSize: '18px' }}>Note</span>
              <div className="form-group-custom">
                <TextArea
                  name="note"
                  value={formik.values.note}
                  size="large"
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                  {...formik.getFieldProps('note')}
                  maxLength={254}
                />
              </div>
            </div>
          </div>
          <div className="align-button-right">
            <button
              disabled={formik.errors.user || formik.errors.asset}
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

export default EditAssignmentPage;
