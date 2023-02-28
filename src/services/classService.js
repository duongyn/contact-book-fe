import instance from '../httpClient/axiosInstance';
import AuthHeaders from './AuthHeader';

const getDefault = () => {
  return instance.get('/classes', {
    headers: AuthHeaders(),
  });
};

const getListBySearchKey = data => {
  return instance.post('/classes/search', data, {
    headers: AuthHeaders(),
  });
};

const getByID = id => {
  return instance.get(`/classes/${id}`, {
    headers: AuthHeaders(),
  });
};

const deleteAssignment = id => {
  return instance.delete(`/classes/${id}`, { headers: AuthHeaders() });
};

const AssignService = {
  getDefault,
  getByID,
  getListBySearchKey,
  deleteAssignment,
};

export default AssignService;
