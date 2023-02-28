import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Space, Button, Tooltip } from 'antd';

const configTableColumns = (showDetailModal, showDeleteModal, navigate, showAcceptModal) => {
  const tableColumns = [
    {
      title: 'No.',
      dataIndex: 'requestId',
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => {
          const codeA = a.requestId;
          const codeB = b.requestId;
          if (codeA < codeB) {
            return -1;
          }
          if (codeA > codeB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Asset Code',
      dataIndex: 'assetCode',
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => {
          const codeA = a.assetCode;
          const codeB = b.assetCode;
          if (codeA < codeB) {
            return -1;
          }
          if (codeA > codeB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Asset Name',
      dataIndex: 'assetName',
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => {
          const codeA = a.assetName;
          const codeB = b.assetName;
          if (codeA < codeB) {
            return -1;
          }
          if (codeA > codeB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Requested by',
      dataIndex: 'requestBy',
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => {
          const codeA = a.requestBy;
          const codeB = b.requestBy;
          if (codeA < codeB) {
            return -1;
          }
          if (codeA > codeB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Assigned Date',
      dataIndex: 'assignDateString',
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => {
          const codeA = a.assignDateString;
          const codeB = b.assignDateString;
          if (codeA < codeB) {
            return -1;
          }
          if (codeA > codeB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Accepted by',
      dataIndex: 'acceptBy',
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => {
          const codeA = a.acceptBy;
          const codeB = b.acceptBy;
          if (codeA < codeB) {
            return -1;
          }
          if (codeA > codeB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Returned Date',
      dataIndex: 'returnDate',
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => {
          const codeA = a.returnDate;
          const codeB = b.returnDate;
          if (codeA < codeB) {
            return -1;
          }
          if (codeA > codeB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'State',
      dataIndex: 'state',
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => {
          const codeA = a.state;
          const codeB = b.state;
          if (codeA < codeB) {
            return -1;
          }
          if (codeA > codeB) {
            return 1;
          }
          return 0;
        },
      },
      sortDirections: ['ascend', 'descend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: '',
      render: record =>
        record.state === 'Completed' ? (
          <Space size="small">
            <Tooltip title="complete">
              <Button type="text" icon={<CheckOutlined />} disabled />
            </Tooltip>
            <Tooltip title="cancel">
              <Button type="text" icon={<CloseCircleOutlined />} disabled />
            </Tooltip>
          </Space>
        ) : (
          <Space size="small">
            <Tooltip title="complete">
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => {
                  showAcceptModal(record);
                }}
              />
            </Tooltip>
            <Tooltip title="cancel">
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
        ),
    },
  ];
  return tableColumns;
};

export default configTableColumns;
