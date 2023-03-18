import instance from '../httpClient/axiosInstance';
import AuthHeaders from './AuthHeader';

const getAll = () => {
  return instance.get('/subjects', {
    headers: AuthHeaders(),
  });
}

const getByID = code => {
  return instance.get(`/subjects/${code}`, {
    headers: AuthHeaders(),
  });
};

const deleteById = code => {
  return instance.put(`/subjects/delete/${code}`, {
    headers: AuthHeaders(),
  });
}

const SubjectService = {
  getByID,
  getAll,
  deleteById
};

export default SubjectService;
