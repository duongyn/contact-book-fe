import { Space, Modal } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import { CloseSquareOutlined } from '@ant-design/icons';
import moment from 'moment';

const DetailModal = detailModalData => {
  return (
    <Modal
      title="Return Request Detail"
      width={575}
      footer={null}
      visible={detailModalData.isDetailModalVisible}
      onCancel={detailModalData.handleCancel}
      closeIcon={<CloseSquareOutlined style={{ color: '#D6001C' }} />}
    >
      <Row>
        <Space size="small">
          <p className="field_name">Asset Code: </p>{' '}
          <p className="field_value">{detailModalData.assetCode}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Asset Name: </p>{' '}
          <p className="field_value">{detailModalData.assetName}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Requested By: </p>{' '}
          <p className="field_value">{detailModalData.requestBy}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Assigned Date: </p>{' '}
          <p className="field_value">{detailModalData.assignDateString}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Accepted By: </p>{' '}
          <p className="field_value">{detailModalData.acceptBy}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Returned Date: </p>{' '}
          <p className="field_value">
            {moment(new Date(detailModalData.returnDate)).format('MM/DD/yyyy')}
          </p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">State: </p>{' '}
          <p className="field_value">{detailModalData.state}</p>
        </Space>
      </Row>
    </Modal>
  );
};

export default DetailModal;
