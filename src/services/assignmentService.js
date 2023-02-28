import instance from '../httpClient/axiosInstance';
import { END_POINT } from '../httpClient/config';
import httpClient from '../httpClient/httpClient';
import AuthHeaders from './AuthHeader';

const createNewAssignment = assignment => {
  return httpClient.createNewAssignment(END_POINT.createNewAssignment, assignment);
};

const updateAssignment = assignment => {
  return httpClient.updateAssignment(END_POINT.createNewAssignment, assignment);
};
const createUserRequest = (username, assignId) => {
  return instance.post(
    `/return-requests/?username=` + username + `&assignId=` + assignId,
    { data: {} },
    {
      headers: AuthHeaders(),
    }
  );
};

const respondToAssignment = data => {
  return instance.patch(`/assignments/users-response`, data, {
    headers: AuthHeaders(),
  });
};
const AssignmentService = {
  createNewAssignment,
  updateAssignment,
  createUserRequest,
  respondToAssignment,
};

export default AssignmentService;
