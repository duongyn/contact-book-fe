import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Space, Button, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const navigate = useNavigate;

const configTableColumns = (showDetailModal) => {
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
      title: 'Tên lớp',
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
      title: <div style={{ padding: '0px 0px 0px 0px' }}>Khối</div>,
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
      title: 'Tên giáo viên',
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
    }
  ];
  return tableColumns;
};

export default configTableColumns;
