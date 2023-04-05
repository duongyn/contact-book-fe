import instance from '../httpClient/axiosInstance';
import AuthHeaders from './AuthHeader';

const getByStudent = code => {
  return instance.get(`/marks/by-student/${code}`, {
    headers: AuthHeaders(),
  });
}

const getAll = () => {
  return instance.get(`/marks`, {
    headers: AuthHeaders(),
  });
}

const create = data => {
    return instance.post('/marks', data, {
        headers: AuthHeaders()
    });
}

const update = data => {
    return instance.put('/marks', data, {
        headers: AuthHeaders()
    });
}


const MarkService = {
  getAll,
  create,
  update,
  getByStudent
};

export default MarkService;
