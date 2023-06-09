import instance from '../httpClient/axiosInstance';
import AuthHeaders from './AuthHeader';

const getAll = () => {
  return instance.get('/attendances', {
    headers: AuthHeaders(),
  });
}

const findByUserAndDate = (userCode, date) => {
  return instance.get(`/attendances/by-user-date/${userCode}/${date}`, {
    headers: AuthHeaders(),
  });
}

const findByClassAndDate = (className, date) => {
  return instance.get(`/attendances/by-class-date/${className}/${date}`, {
    headers: AuthHeaders(),
  });
}

const create = data => {
    return instance.post('/attendances', data, {
        headers: AuthHeaders()
    });
}

const update = data => {
    return instance.put('/attendances', data, {
        headers: AuthHeaders()
    });
}

const checkUserAttend = data => {
    return instance.post('/attendances/check-attend', data, {
        headers: AuthHeaders()
    });
}
const AttendanceService = {
  getAll,
  create,
  update,
  checkUserAttend,
  findByUserAndDate,
  findByClassAndDate
};

export default AttendanceService;
