export const CONFIG = {
  baseUrl: process.env.REACT_APP_API_KEY,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const END_POINT = {
  login: '/authenticate',
  listUsers: '/users',
  checkUser: '/users/check',
  disableUser: '/users/delete',
  updatePasswordFirstTime: '/update-password-first-time',
  changePassword: '/users/change-password',
  checkPassword: '/users/get-password',
  getValidAssetsForAssignment: '/assets/available-for-assignment',
  createNewAssignment: '/classes',
  report: '/reports',
  getValidAssetsForUpdateAssignment: '/assets/available-for-update-assignment',
  userAssignList: '/assignments/my-assignments',
  assignmentDetail: '/class',
  acceptReturnRequest: '/return-requests/accept',
};
