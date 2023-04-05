import { Space, Modal } from 'antd';
import { Row } from 'antd/lib/grid';
import { CloseSquareOutlined } from '@ant-design/icons';
import moment from 'moment';

const DetailModal = detailModalData => {
  return (
    <Modal
      title="Schedule Detail"
      width={575}
      footer={null}
      visible={detailModalData.isDetailModalVisible}
      onCancel={detailModalData.handleCancel}
      closeIcon={<CloseSquareOutlined style={{ color: '#D6001C' }} />}
    >
      <Row>
        <Space size="small">
          <p className="field_name">Schedule Id: </p>{' '}
          <p className="field_value">{detailModalData.scheduleId}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Schedule Date: </p>{' '}
          <p className="field_value">{detailModalData.scheduleTime}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">From: </p>{' '}
          <p className="field_value">{detailModalData.scheduleFrom}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">To: </p>{' '}
          <p className="field_value">{detailModalData.scheduleTo}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Class Name: </p>{' '}
          <p className="field_value">{detailModalData.className}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Subject Name: </p>{' '}
          <p className="field_value">{detailModalData.subjectName}</p>
        </Space>
      </Row>
    </Modal>
  );
};

export default DetailModal;
