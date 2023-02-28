import Modal from 'antd/lib/modal/Modal';
import { Input, Table, Button } from 'antd';
import { useFormik } from 'formik';

const { Search } = Input;

const assetColumns = [
  {
    title: 'Asset Code',
    dataIndex: 'assetCode',
    sorter: {
      compare: (a, b) => {
        return a.assetCode.localeCompare(b.assetCode);
      },
    },
  },
  {
    title: 'Asset Name',
    dataIndex: 'name',
    sorter: {
      compare: (a, b) => {
        return a.name.localeCompare(b.name);
      },
    },
  },
  {
    title: 'Category',
    dataIndex: 'category',
    sorter: {
      compare: (a, b) => {
        return a.category.localeCompare(b.category);
      },
    },
  },
];
function AssetModalComponent({
  visible,
  handleAssetOk,
  handleAssetCancel,
  handleSearchAssetModal,
  setSelectedRow,
  showAssetData,
  afterClose,
}) {
  const rowSelection = {
    onChange: (selectedKey, selectedRows) => {
      setSelectedRow(selectedRows[0]);
    },
  };

  const formik = useFormik({
    initialValues: {
      assetSearchInput: '',
    },
    validate: values => {
      let errors = {};
      if (values.assetSearchInput.trim().length >= 50) {
        errors.assetSearchInput = 'Too Long !';
      }
      return errors;
    },
    initialTouched: {
      assetSearchInput: true,
    },
  });

  return (
    <>
      <Modal
        destroyOnClose={true}
        afterClose={() => {
          formik.setFieldValue('assetSearchInput', '');
          afterClose();
        }}
        visible={visible}
        closable={false}
        className="modal-custom"
        maskClosable={true}
        mask={true}
        keyboard={true}
        footer={[
          <Button key={3} type="primary" className="save-user-btn" onClick={handleAssetOk}>
            Save
          </Button>,
          <Button key={4} onClick={handleAssetCancel} className="cancel-user-btn">
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
            Select Asset
          </p>
          <div>
            <Search
              name="assetSearchInput"
              onSearch={handleSearchAssetModal}
              style={{
                width: 200,
              }}
              {...formik.getFieldProps('assetSearchInput')}
              maxLength={50}
            />
            {formik.touched.assetSearchInput && formik.errors.assetSearchInput ? (
              <div style={{ textAlign: 'center', color: 'red' }}>
                {formik.errors.assetSearchInput}
              </div>
            ) : null}
          </div>
        </div>

        <Table
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          columns={assetColumns}
          dataSource={showAssetData}
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

export default AssetModalComponent;
