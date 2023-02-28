import { useState, useEffect } from 'react';
import { Table, Modal, Space, Tooltip, message } from 'antd';
import 'antd/dist/antd.min.css';
import './css/UserAssignList.css';
import { END_POINT } from '../../httpClient/config';
import { Row } from 'antd';
import { Button } from 'antd';
import useAuth from '../../hooks/useAuth';
import { CheckOutlined, CloseOutlined, RedoOutlined } from '@ant-design/icons';
import instance from '../../httpClient/axiosInstance';
import AssignmentService from '../../services/assignmentService';
import { showErrorMessage, showSuccessMessage } from '../../util/toastdisplay';
import { useNavigate } from 'react-router-dom';
import { SortDirection } from '../../context/SortDirection';
import ReturnRequestService from '../../services/returnRequestService';
const assignmentss = [];

const AssignmentPage = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [page, setPage] = useState(1);
  const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
  const [returnModalData, setReturnModalData] = useState({});
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [acceptModalData, setAcceptModalData] = useState({});
  const [isDeclineModalVisible, setIsDeclineModalVisible] = useState(false);
  const [declineModalData, setDeclineModalData] = useState({});

  const currentUsername = useAuth().user.sub;
  const navigate = useNavigate();
  const [detail, setDetail] = useState({
    id: 0,
    assetCode: null,
    assetName: null,
    specification: null,
    assignedTo: null,
    assignedBy: null,
    assignedDate: null,
    state: null,
    note: null,
  });
  const columns = [
    {
      title: 'Asset Code',
      dataIndex: 'assetCode',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.assetCode.toLowerCase().localeCompare(b.assetCode.toLowerCase()),
      ellipsis: true,
      onCell: record => {
        return {
          onClick: () => {
            showModal(record);
          },
        };
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Asset Name',
      dataIndex: 'assetName',
      sorter: (a, b) => a.assetName.toLowerCase().localeCompare(b.assetName.toLowerCase()),
      ellipsis: true,
      onCell: record => {
        return {
          onClick: () => {
            showModal(record);
          },
        };
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedBy',
      sorter: (a, b) => a.assignedBy.toLowerCase().localeCompare(b.assignedBy.toLowerCase()),
      ellipsis: true,
      onCell: record => {
        return {
          onClick: () => {
            showModal(record);
          },
        };
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Assigned Date',
      dataIndex: 'assignedDate',
      sorter: (a, b) => a.assignedDate.toLowerCase().localeCompare(b.assignedDate.toLowerCase()),
      ellipsis: true,
      onCell: record => {
        return {
          onClick: () => {
            showModal(record);
          },
        };
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'State',
      dataIndex: 'state',
      sorter: (a, b) => a.state.toLowerCase().localeCompare(b.state.toLowerCase()),
      ellipsis: true,
      onCell: record => {
        return {
          onClick: () => {
            showModal(record);
          },
        };
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
      width: '25%',
    },
    {
      title: '',
      render: record =>
        record.state === 'Accepted' ? (
          <Space size="small">
            <Tooltip title="accept">
              <Button className="accept-btn" type="text" icon={<CheckOutlined />} disabled />
            </Tooltip>
            <Tooltip title="decline">
              <Button className="decline-btn" type="text" icon={<CloseOutlined />} disabled />
            </Tooltip>
            <Tooltip title="return">
              <Button
                className="return-btn"
                type="text"
                icon={<RedoOutlined />}
                onClick={() => {
                  showReturnModal(record);
                }}
              />
            </Tooltip>
          </Space>
        ) : (
          <Space size="small">
            <Tooltip title="accept">
              <Button
                className="accept-btn"
                type="text"
                icon={<CheckOutlined />}
                onClick={() => {
                  showAcceptModal(record);
                }}
              />
            </Tooltip>
            <Tooltip title="decline">
              <Button
                className="decline-btn"
                type="text"
                icon={<CloseOutlined />}
                onClick={() => {
                  showDeclineModal(record);
                }}
              />
            </Tooltip>
            <Tooltip title="return">
              <Button className="return-btn" type="text" icon={<RedoOutlined />} disabled />
            </Tooltip>
          </Space>
        ),
    },
  ];

  useEffect(() => {
    let disable = false;
    instance
      .post(
        END_POINT.userAssignList,
        { data: {} },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
      .then(response => {
        setLoading(false);
        if (assignmentss.length <= 0) {
          response.data.map((e, index) => {
            assignmentss.push({
              key: index,
              id: e.id,
              assetCode: e.assetCode,
              assetName: e.assetName,
              assignedBy: e.assignedBy,
              assignedDate: e.assignedDate,
              state: e.state,
              specification: e.specification,
              assignedTo: e.assignedTo,
              note: e.note,
            });
          });
        }
        setAssignments(assignmentss);
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

  const showAcceptModal = data => {
    setIsAcceptModalVisible(true);
    setAcceptModalData(data.id);
  };

  const showDeclineModal = data => {
    setIsDeclineModalVisible(true);
    setDeclineModalData(data.id);
  };

  const showReturnModal = data => {
    setIsReturnModalVisible(true);
    setReturnModalData(data.id);
  };

  const showModal = r => {
    setIsModalVisible(true);
    setDetail(r);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    if (isModalVisible) {
      setIsModalVisible(false);
      return;
    }
    if (isAcceptModalVisible) {
      setIsAcceptModalVisible(false);
      return;
    }
    if (isDeclineModalVisible) {
      setIsDeclineModalVisible(false);
      return;
    }
    if (isReturnModalVisible) {
      setIsReturnModalVisible(false);
      return;
    }
  };

  const handleAccept = () => {
    let inputDTO = {
      assignmentID: acceptModalData,
      action: 'Accept',
    };
    AssignmentService.respondToAssignment(inputDTO)
      .then(response => {
        setIsAcceptModalVisible(false);
        showSuccessMessage('Accept assignment successful');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        if (error.response.status === 400 || error.response.status === 401) {
          showErrorMessage('Your session has expired');
          localStorage.removeItem('token');
          navigate('/login');
        }
        setIsAcceptModalVisible(false);
        showErrorMessage('Error: ' + error.response.data);
      });
  };

  const handleDecline = () => {
    let assignment = {
      assignmentID: declineModalData,
      action: 'Decline',
    };
    AssignmentService.respondToAssignment(assignment)
      .then(response => {
        setIsDeclineModalVisible(false);
        showSuccessMessage('Decline assignment successful');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        if (error.response.status === 400 || error.response.status === 401) {
          showErrorMessage('Your session has expired');
          localStorage.removeItem('token');
          navigate('/login');
        }
        setIsDeclineModalVisible(false);
        showErrorMessage('Error: ' + error.response.data);
      });
  };

  const handleReturnModal = () => {
    const requestDto = {
      assignmentId: returnModalData,
    };
    ReturnRequestService.createReturnRequest(requestDto)
      .then(response => {
        showSuccessMessage('Success create return request!');
        setIsReturnModalVisible(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        setIsReturnModalVisible(false);
        showErrorMessage('Error: ' + error.response.data);
      });
  };

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Previous</a>;
    }
    if (type === 'next') {
      return <a>Next</a>;
    }
    return originalElement;
  };

  return (
    <>
      {children}
      <div style={{ display: 'block', width: '1000px' }}>
        <Row style={{ marginBottom: '20px' }}>
          <p className="title">My Assignment</p>
        </Row>
        <Table
          columns={columns}
          dataSource={assignments}
          pagination={{
            defaultPageSize: 10,
            hideOnSinglePage: true,
            itemRender: itemRender,
            current: page,
            onChange: page => {
              setPage(page);
            },
          }}
          rowKey="key"
        />
        <Modal
          title="Detailed Assignment Information"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <p>ID: {detail.id}</p>
          <p>Asset Code: {detail.assetCode}</p>
          <p>Asset Name: {detail.assetName}</p>
          <p>Specification: {detail.specification}</p>
          <p>Assigned to: {detail.assignedTo}</p>
          <p>Assigned by: {detail.assignedBy}</p>
          <p>Assigned Date: {detail.assignedDate}</p>
          <p>State: {detail.state}</p>
          <p>Note: {detail.note}</p>
        </Modal>
        <Modal
          title="Are you sure"
          visible={isAcceptModalVisible}
          onCancel={handleCancel}
          onOk={handleAccept}
          okText="Accept"
        >
          <p>Are you sure want to accept this assignment ?</p>
        </Modal>
        <Modal
          title="Are you sure?"
          visible={isDeclineModalVisible}
          onCancel={handleCancel}
          onOk={handleDecline}
          okText="Decline"
        >
          <p>Are you sure want to decline this assignment ?</p>
        </Modal>
        <Modal
          title="Are you sure?"
          visible={isReturnModalVisible}
          onCancel={handleCancel}
          onOk={handleReturnModal}
          okText="Yes"
          cancelText="No"
        >
          <p>Do you want to create a returning request for this asset?</p>
        </Modal>
      </div>
    </>
  );
};

export default AssignmentPage;
