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
          <p className="field_name">ID lớp: </p>{' '}
          <p className="field_value">{detailModalData.id}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Tên lớp: </p>{' '}
          <p className="field_value">{detailModalData.className}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Khối: </p>{' '}
          <p className="field_value">{detailModalData.classGrade}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">Giáo Viên: </p>{' '}
          <p className="field_value">{detailModalData.formTeacherCode}</p>
        </Space>
      </Row>
      <Row>
        <Space size="small">
          <p className="field_name">DS học sinh: </p>{' '}
          <div className="field_value">{detailModalData.listStudentCode.map((el, index) => 
            <div key={index}>{el} </div>
          )}</div>
        </Space>
      </Row>
    </Modal>
  );
};

export default DetailModal;
