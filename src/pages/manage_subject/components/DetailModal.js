import { Space, Modal } from 'antd';
import { Row } from 'antd/lib/grid';
import { CloseSquareOutlined } from '@ant-design/icons';
import moment from 'moment';

const DetailModal = detailModalData => {
  return (
    <Modal
      title="Subject Detail"
      width={575}
      footer={null}
      visible={detailModalData.isDetailModalVisible}
      onCancel={detailModalData.handleCancel}
      closeIcon={<CloseSquareOutlined style={{ color: '#D6001C' }} />}
    >
      <Row>
        <Space size="small">
          <p className="field_name">ID: </p>{' '}
          <p className="field_value">{detailModalData.subjectId}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Tên môn học: </p>{' '}
          <p className="field_value">{detailModalData.subjectName}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Khối: </p>{' '}
          <p className="field_value">{detailModalData.subjectGrade}</p>
        </Space>
      </Row>
    </Modal>
  );
};

export default DetailModal;
