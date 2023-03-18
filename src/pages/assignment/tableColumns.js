import { EditFilled, CloseCircleOutlined, UndoOutlined } from '@ant-design/icons';
import { Space, Button, Tooltip } from 'antd';
import ReturnRequestService from '../../services/returnRequestService';
import './css/AdminAssignList.css';

const configTableColumns = (showDetailModal, showDeleteModal, showReturnModal, navigate) => {
  const isWaitForReturning = async assignId => {
    const response = await ReturnRequestService.isWaitForReturning(assignId);
    return response.data;
  };

  const tableColumns = [
    {
      title: <div style={{ padding: '0px 0px 0px 0px' }}>No.</div>,
      width: 100,
      dataIndex: 'id',
      sorter: {
        compare: (a, b) => {
          const noA = a.id;
          const noB = b.id;
          if (noA < noB) {
            return -1;
          }
          if (noA > noB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: record => {
        return {
          onClick: () => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Class Name',
      dataIndex: 'className',
      width: 300,
      sorter: {
        compare: (a, b) => {
          const codeA = a.className.toUpperCase();
          const codeB = b.className.toUpperCase();
          if (codeA < codeB) {
            return -1;
          }
          if (codeA > codeB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: record => {
        return {
          onClick: () => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: <div style={{ padding: '0px 0px 0px 0px' }}>Class Grade</div>,
      dataIndex: 'classGrade',
      width: 200,
      sorter: {
        compare: (a, b) => {
          const nameA = a.classGrade.toUpperCase();
          const nameB = b.classGrade.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: record => {
        return {
          onClick: () => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Teacher Name',
      dataIndex: 'formTeacherCode',
      width: 300,
      sorter: {
        compare: (a, b) => {
          const assignToA = a.formTeacherCode.toUpperCase();
          const assignToB = b.formTeacherCode.toUpperCase();
          if (assignToA < assignToB) {
            return -1;
          }
          if (assignToA > assignToB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: record => {
        return {
          onClick: () => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: '',
      render: record =>
      <Space size="small">
      <Tooltip title="edit">
        <Button
          type="text"
          icon={<EditFilled />}
          onClick={() => {
            navigate(`/class/edit`, { state: { editClass: record } });
          }}
        />
      </Tooltip>
      <Tooltip title="delete">
        <Button
          type="text"
          icon={<CloseCircleOutlined />}
          style={{ color: '#D6001C' }}
          onClick={() => {
            showDeleteModal(record);
          }}
        />
      </Tooltip>
    </Space>
    },
  ];
  return tableColumns;
};

export default configTableColumns;
