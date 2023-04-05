export const ROLE = {
  ADMIN: 'ROLE_ADMIN',
  MANAGER: 'ROLE_MANAGER',
  STUDENT: 'ROLE_STUDENT',
  TEACHER: 'ROLE_TEACHER'
};

export const STUDENT_SIDEBAR = [{ content: 'Trang chủ', route: '/' }];

export const ADMIN_SIDEBAR = [
  { content: 'Trang chủ', route: '/' },
  { content: 'Quản lý người dùng', route: '/user' },
];

export const MANAGER_SIDEBAR = [
  { content: 'Trang chủ', route: '/' },
  { content: 'Quản lý người dùng', route: '/user' },
  { content: 'Quản lý môn học', route: '/subject' },
  { content: 'Quản lý lớp học', route: '/class' },
  { content: 'Quản lý thời khóa biểu', route: '/schedule' }
];

export const TEACHER_SIDEBAR = [
  { content: 'Trang chủ', route: '/' },
  { content: 'Quản lý môn học', route: '/subject' },
  { content: 'Quản lý lớp học', route: '/class' },
  { content: 'Quản lý điểm học sinh', route: '/mark' },
  { content: 'Quản lý điểm danh', route: '/attendance' }
];
