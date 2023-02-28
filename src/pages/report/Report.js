import { useState, useEffect } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.min.css';
import { CONFIG, END_POINT } from '../../httpClient/config';

import { useNavigate } from 'react-router-dom';
import instance from '../../httpClient/axiosInstance';
import ExportCSV from './ExportCsv';
import AuthHeaders from '../../services/AuthHeader';
import { SortDirection } from '../../context/SortDirection';
import { Row } from 'react-bootstrap';
const navigate = useNavigate;

const itemRender = (_, type, originalElement) => {
  if (type === 'prev') {
    return <a>Previous</a>;
  }
  if (type === 'next') {
    return <a>Next</a>;
  }
  return originalElement;
};

const ReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [report, setReport] = useState([]);
  const [page, setPage] = useState(1);
  const columns = [
    {
      title: 'Category',
      dataIndex: 'categoryName',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.categoryName.toLowerCase().localeCompare(b.categoryName.toLowerCase()),
      ellipsis: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Total',
      dataIndex: 'total',
      sorter: (a, b) => a.total - b.total,
      ellipsis: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Assigned',
      dataIndex: 'assigned',
      sorter: (a, b) => a.assigned - b.assigned,
      ellipsis: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Available',
      dataIndex: 'available',
      sorter: (a, b) => a.available - b.available,
      ellipsis: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Not available',
      dataIndex: 'notAvailable',
      sorter: (a, b) => a.notAvailable - b.notAvailable,
      ellipsis: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Waiting for recycling',
      dataIndex: 'waitingForRecycling',
      sorter: (a, b) => a.waitingForRecycling - b.waitingForRecycling,
      ellipsis: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      width: '20%',
    },
    {
      title: 'Recycled',
      dataIndex: 'recycling',
      sorter: (a, b) => a.recycling - b.recycling,
      ellipsis: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
  ];
  useEffect(() => {
    let disable = false;
    instance
      .get(END_POINT.report, {
        headers: AuthHeaders(),
      })
      .then(response => {
        setLoading(false);
        setReport(response.data);
      })
      .catch(() => {
        if (!disable) {
          setLoading(false);
          setError('Error !');
        }
      });
    return () => {
      disable = true;
    };
  }, []);
  if (loading) {
    return <h1>Loading</h1>;
  }

  return (
    <div style={{ display: 'block', width: '1000px', marginRight: 10 }}>
      <Row justify="start" align="left">
        <h2 className="title">Report</h2>
      </Row>
      <ExportCSV csvData={report} fileName="report" />
      <Table
        columns={columns}
        dataSource={report}
        pagination={{
          defaultPageSize: 10,
          hideOnSinglePage: true,
          itemRender: itemRender,
          current: page,
          onChange: page => {
            setPage(page);
          },
        }}
      />
    </div>
  );
};
export default ReportPage;
