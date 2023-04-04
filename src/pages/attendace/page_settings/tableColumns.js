import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Space, Button, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const navigate = useNavigate;

const configTableColumns = (showDetailModal, showDeleteModal) => {
  const tableColumns = [
    {
      title: 'Schedule Id',
      dataIndex: 'scheduleId',
      defaultSortOrder: 'ascend',
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Schedule Time',
      dataIndex: 'scheduleTime',
      sorter: (a, b) => a.scheduleTime.toLowerCase().localeCompare(b.scheduleTime.toLowerCase()),
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Schedule From',
      dataIndex: 'scheduleFrom',
      sorter: (a, b) => a.scheduleFrom.toLowerCase().localeCompare(b.scheduleFrom.toLowerCase()),
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Schedule To',
      dataIndex: 'scheduleTo',
      sorter: (a, b) => a.scheduleTo.toLowerCase().localeCompare(b.scheduleTo.toLowerCase()),
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Class Name',
      dataIndex: 'className',
      sorter: (a, b) => a.className.toLowerCase().localeCompare(b.className.toLowerCase()),
      sortDirections: ['ascend', 'descend', 'ascend'],
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            showDetailModal(record);
          },
        };
      },
    },
    {
      title: 'Subject Name',
      dataIndex: 'subjectName',
      sorter: (a, b) => a.subjectName.toLowerCase().localeCompare(b.subjectName.toLowerCase()),
      sortDirections: ['ascend', 'descend', 'ascend'],
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
        <Space size="small">
          <Tooltip title="attendance">
            <Link to={{ pathname: '/attendance/check/' + record.scheduleId }}>
              <Button type="text" icon={<CheckOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title="delete">
            <Button
              type="text"
              icon={<CloseCircleOutlined style={{ color: '#D6001C' }} />}
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
