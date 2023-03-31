import { Space, Table, Modal } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import { CloseSquareOutlined } from '@ant-design/icons';

const StudentModal = studentListData => {

    const userColumns = [
        {
            title: 'Code',
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
            title: 'Họ Tên',
            dataIndex: 'fullName',
            sorter: {
                compare: (a, b) => {
                    return a.fullName.localeCompare(b.fullName);
                },
            },
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            sorter: {
                compare: (a, b) => {
                    return a.dob.localeCompare(b.dob);
                },
            },
        },
        {
            title: 'Vai trò',
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
            title="Danh sách học sinh thích hợp"
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
