import instance from '../httpClient/axiosInstance';
import { END_POINT } from '../httpClient/config';
import authHeader from './AuthHeader';

const create = data => {
  return instance.post(END_POINT.listUsers, data, { headers: authHeader() });
};
const edit = data => {
  return instance.put(END_POINT.listUsers, data, { headers: authHeader() });
};

const getById = code => {
  return instance.get(END_POINT.listUsers + `/${code}`, { headers: authHeader() });
};

const getAllUsers = () => {
  return instance.get(END_POINT.listUsers, { headers: authHeader() });
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
  getById,
  getUsersInAdminLocation,
  getListWithCreatedUser,
  getListWithEditUser,
};

export default UserService;
