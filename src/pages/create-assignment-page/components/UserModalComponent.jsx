import { Button, Input, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { useFormik } from 'formik';

const { Search } = Input;

const userColumns = [
  {
    title: 'Staff Code',
    dataIndex: 'staffCode',
    sorter: {
      compare: (a, b) => {
        let aStaffCode = parseInt(a.staffCode.substring(2));
        let bStaffCode = parseInt(b.staffCode.substring(2));
        return aStaffCode - bStaffCode;
      },
    },
  },
  {
    title: 'Full Name',
    dataIndex: 'fullName',
    sorter: {
      compare: (a, b) => {
        return a.fullName.localeCompare(b.fullName);
      },
    },
  },
  {
    title: 'Type',
    dataIndex: 'type',
    sorter: {
      compare: (a, b) => {
        return a.type.localeCompare(b.type);
      },
    },
  },
];

function UserModalComponent({
  visible,
  handleUserOk,
  handleUserCancel,
  handleSearchUserModal,
  setSelectedRow,
  showUserData,
  afterClose,
}) {
  const rowSelection = {
    onChange: (selectedKey, selectedRows) => {
      setSelectedRow(selectedRows[0]);
    },
  };

  const formik = useFormik({
    initialValues: {
      userSearchInput: '',
    },
    validate: values => {
      let errors = {};
      if (values.userSearchInput.trim().length >= 50) {
        errors.userSearchInput = 'Too Long !';
      }
      return errors;
    },
    initialTouched: {
      userSearchInput: true,
    },
  });

  return (
    <>
      <Modal
        afterClose={() => {
          formik.setFieldValue('userSearchInput', '');
          afterClose();
        }}
        destroyOnClose={true}
        visible={visible}
        closable={false}
        className="modal-custom"
        maskClosable={true}
        mask={true}
        keyboard={true}
        footer={[
          <Button key={1} type="primary" className="save-user-btn" onClick={handleUserOk}>
            Save
          </Button>,
          <Button key={2} onClick={handleUserCancel} className="cancel-user-btn">
            Cancel
          </Button>,
        ]}
      >
        <div className="modal-head">
          <p
            style={{
              fontSize: '20px',
              color: 'rgb(171, 42, 22)',
              fontWeight: '600',
            }}
          >
            Select User
          </p>
          <div>
            <Search
              name="userSearchInput"
              onSearch={handleSearchUserModal}
              style={{
                width: 200,
              }}
              {...formik.getFieldProps('userSearchInput')}
              maxLength={50}
            />
            {formik.touched.userSearchInput && formik.errors.userSearchInput ? (
              <div style={{ textAlign: 'center', color: 'red' }}>
                {formik.errors.userSearchInput}
              </div>
            ) : null}
          </div>
        </div>
        <Table
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          columns={userColumns}
          dataSource={showUserData}
          rowClassName={(record, index) => {}}
          pagination={false}
          scroll={{
            y: 360,
          }}
        />
      </Modal>
    </>
  );
}

export default UserModalComponent;
