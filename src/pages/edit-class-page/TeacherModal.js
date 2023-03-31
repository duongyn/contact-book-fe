import { Space, Table, Modal } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import { CloseSquareOutlined } from '@ant-design/icons';
import moment from 'moment';

const TeacherModal = teacherListData => {

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
            title: 'Họ tên',
            dataIndex: 'fullName',
            sorter: {
                compare: (a, b) => {
                    return a.fullName.localeCompare(b.fullName);
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

    const rowSelection = {
        onChange: (selectedKey, selectedRows) => {
            teacherListData.setSelectedRow(selectedRows[0]);
            console.log(selectedRows[0]);
        },
    };

    return (
        <Modal
            title="DS giáo viên"
            width={575}
            onOk={teacherListData.handleOk}
            visible={teacherListData.isDetailModalVisible}
            destroyOnClose={true}
            onCancel={teacherListData.handleCancel}
            closeIcon={<CloseSquareOutlined style={{ color: '#D6001C' }} />}
        >
            <Table
                rowKey="userCode"
                rowSelection={{
                    type: 'radio',
                    ...rowSelection,
                }}
                columns={userColumns}
                dataSource={teacherListData.dataList}
                rowClassName={(record, index) => { }}
                pagination={false}
                scroll={{
                    y: 360,
                }}
            />
        </Modal>
    );
};

export default TeacherModal;
