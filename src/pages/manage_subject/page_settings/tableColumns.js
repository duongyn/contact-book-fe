import { EditFilled, CloseCircleOutlined } from '@ant-design/icons';
import { Space, Button, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { SortDirection } from '../../../context/SortDirection';

const navigate = useNavigate;

const configTableColumns = (showDetailModal, showDeleteModal) => {
  const tableColumns = [
    {
      title: 'ID',
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
      title: 'Tên môn học',
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
      title: 'Khối',
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
        <Space size="small">
          <Tooltip title="edit">
            <Link to={{ pathname: '/subject/edit/' + record.subjectId }}>
              <Button type="text" icon={<EditFilled />} />
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
