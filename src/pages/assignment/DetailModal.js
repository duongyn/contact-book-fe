import { Space, Modal } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import { CloseSquareOutlined } from '@ant-design/icons';
import moment from 'moment';

const DetailModal = detailModalData => {
  return (
    <Modal
      title="Class Detail"
      width={575}
      footer={null}
      visible={detailModalData.isDetailModalVisible}
      onCancel={detailModalData.handleCancel}
      closeIcon={<CloseSquareOutlined style={{ color: '#D6001C' }} />}
    >
      <Row>
        <Space size="small">
          <p className="field_name">Class Id: </p>{' '}
          <p className="field_value">{detailModalData.id}</p>
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
          <p className="field_name">Grade: </p>{' '}
          <p className="field_value">{detailModalData.classGrade}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Teacher: </p>{' '}
          <p className="field_value">{detailModalData.formTeacherCode}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Student: </p>{' '}
          <p className="field_value">{detailModalData.listStudentCode}</p>
        </Space>
      </Row>
    </Modal>
  );
};

export default DetailModal;
