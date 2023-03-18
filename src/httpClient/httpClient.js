import instance from './axiosInstance';
import AuthHeaders from '../services/AuthHeader';
const postUser = (endPoint, data) => {
  return instance.post(endPoint, data, {});
};

const login = (endPoint, data) => {
  return instance.post(endPoint, data);
};

const updatePasswordFirstTime = (endPoint, data) => {
  return instance.post(endPoint, data, {
    headers: {
      UpdatePasswordFirstTimeToken: `${localStorage.getItem('token')}`,
    },
  });
};

const checkUser = (endPoint, data) => {
  return instance.get(endPoint + '/' + data);
};

const disableUser = (endPoint, data) => {
  return instance.put(endPoint, data, { headers: AuthHeaders() });
};

const changePassword = (endPoint, data) => {
  return instance.put(endPoint, data, {
    headers: AuthHeaders(),
  });
};

const checkPassword = (endPoint, data) => {
  return instance.post(endPoint, data, {
    headers: AuthHeaders(),
  });
};

const getValidAssetsForAssignment = endPoint => {
  return instance.get(endPoint);
};

const createNewAssignment = (endpoint, data) => {
  return instance.post(endpoint, data, {
    headers: AuthHeaders(),
  });
};

const updateAssignment = (endPoint, data) => {
  return instance.put(endPoint, data, {
    headers: AuthHeaders(),
  });
};

const getValidAssetsForUpdateAssignment = endPoint => {
  return instance.get(endPoint, {
    headers: AuthHeaders(),
  });
};

const httpClient = {
  postUser,
  login,
  checkUser,
  disableUser,
  updatePasswordFirstTime,
  changePassword,
  checkPassword,
  getValidAssetsForAssignment,
  createNewAssignment,
  updateAssignment,
  getValidAssetsForUpdateAssignment,
};

export default httpClient;
