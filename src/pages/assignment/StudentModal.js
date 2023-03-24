import { Space, Table, Modal } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import { CloseSquareOutlined } from '@ant-design/icons';

const StudentModal = studentListData => {

    const userColumns = [
        {
            title: 'User Code',
            dataIndex: 'userCode',
            sorter: {
                compare: (a, b) => {
                    let aStaffCode = parseInt(a.userCode.substring(2));
                    let bStaffCode = parseInt(b.userCode.substring(2));
                    return aStaffCode - bStaffCode;
                },
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            sorter: {
                compare: (a, b) => {
                    return a.fullName.localeCompare(b.fullName);
                },
            },
        },
        {
            title: 'Date of birth',
            dataIndex: 'dob',
            sorter: {
                compare: (a, b) => {
                    return a.dob.localeCompare(b.dob);
                },
            },
        },
        {
            title: 'Role',
            dataIndex: 'roleName',
            sorter: {
                compare: (a, b) => {
                    return a.roleName.localeCompare(b.roleName);
                },
            },
        },
    ];

    let userList = [];

    const rowSelection = {
        onChange: (selectedKey, selectedRows) => {
            studentListData.setSelectedRow(selectedRows);
        },
    };

    return (
        <Modal
            title="List of available students"
            width={575}
            onOk={studentListData.handleOk}
            visible={studentListData.isDetailModalVisible}
            destroyOnClose={true}
            onCancel={studentListData.handleCancel}
            closeIcon={<CloseSquareOutlined style={{ color: '#D6001C' }} />}
        >
            <Table
                rowKey="userCode"
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                columns={userColumns}
                dataSource={studentListData.dataList}
                rowClassName={(record, index) => { }}
                pagination={false}
                scroll={{
                    y: 360,
                }}
            />
        </Modal>
    );
};

export default StudentModal;
