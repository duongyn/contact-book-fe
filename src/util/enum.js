export const ROLE = {
  ADMIN: 'ROLE_ADMIN',
  STAFF: 'ROLE_STAFF',
  STUDENT: 'ROLE_STUDENT'
};

export const STAFF_SIDEBAR = [{ content: 'Trang chủ', route: '/' }];

export const ADMIN_SIDEBAR = [
  { content: 'Trang chủ', route: '/' },
  { content: 'Quản lý người dùng', route: '/user' },
  { content: 'Quản lý môn học', route: '/subject' },
  { content: 'Quản lý lớp học', route: '/class' },
  { content: 'Quản lý thời khóa biểu', route: '/schedule' }
];
