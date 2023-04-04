import instance from '../httpClient/axiosInstance';
import { END_POINT } from '../httpClient/config';
import authHeader from './AuthHeader';

const create = data => {
  return instance.post(END_POINT.listUsers, data, { headers: authHeader() });
};
const edit = data => {
  return instance.put(END_POINT.listUsers + '/update', data, { headers: authHeader() });
};

const getByUsername = username => {
  return instance.get(END_POINT.listUsers + `/get/${username}`, { headers: authHeader() });
};

const getByCode = code => {
  return instance.get(END_POINT.listUsers + `/${code}`, { headers: authHeader() });
};

const getAllUsers = () => {
  return instance.get(END_POINT.listUsers, { headers: authHeader() });
}

const getAllUsersByClass = className => {
  return instance.get(END_POINT.listUsers + `/by-class/${className}`, { headers: authHeader() });
}

const getUsersInAdminLocation = adminCode => {
  return instance.get(END_POINT.listUsers + '/get/' + adminCode, { headers: authHeader() });
};

const getListWithCreatedUser = username => {
  return instance.get(END_POINT.listUsers + `/list-with-last-created/${username}`);
};

const getListWithEditUser = username => {
  return instance.get(END_POINT.listUsers + `/list-with-last-edit/${username}`);
};

const UserService = {
  create,
  edit,
  getByUsername,
  getUsersInAdminLocation,
  getListWithCreatedUser,
  getListWithEditUser,
  getByCode,
  getAllUsers,
  getAllUsersByClass
};

export default UserService;
