import { EditFilled, CloseCircleOutlined } from '@ant-design/icons';
import { Space, Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SortDirection } from '../../../context/SortDirection';

const navigate = useNavigate;

const configTableColumns = (showDetailModal, showDeleteModal) => {
  const tableColumns = [
    {
      title: 'Subject Id',
      dataIndex: 'subjectId',
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
      title: 'Subject Grade',
      dataIndex: 'subjectGrade',
      sorter: (a, b) => a.subjectGrade.toLowerCase().localeCompare(b.subjectGrade.toLowerCase()),
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
        record.state === 'Assigned' ? (
          <Space size="small">
            <Tooltip title="edit">
              <Button type="text" icon={<EditFilled />} disabled />
            </Tooltip>
            <Tooltip title="delete">
              <Button type="text" icon={<CloseCircleOutlined />} disabled />
            </Tooltip>
          </Space>
        ) : (
          <Space size="small">
            <Tooltip title="edit">
              <Button
                type="text"
                icon={<EditFilled />}
                onClick={() => {
                  navigate(``);
                }}
              />
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
        ),
    },
  ];
  return tableColumns;
};

export default configTableColumns;
