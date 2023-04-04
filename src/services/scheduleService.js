import instance from '../httpClient/axiosInstance';
import AuthHeaders from './AuthHeader';

const getAll = () => {
  return instance.get('/schedules', {
    headers: AuthHeaders(),
  });
}

const getByTeaccher = code => {
  return instance.get(`/schedules/teacher/${code}`, {
    headers: AuthHeaders(),
  });
}

const getSlots = () => {
  return instance.get('/schedules/all-slots', {
    headers: AuthHeaders(),
  });
}

const getSubjectsByClassName = data => {
  return instance.get(`/schedules/get-subjects/${data}`, {
    headers: AuthHeaders(),
  });
}

const create = data => {
    return instance.post('/schedules', data , {
        headers: AuthHeaders()
    });
};

const update = data => {
    return instance.put('/schedules', data, {
        headers: AuthHeaders()
    })
};

const getByID = code => {
  return instance.get(`/schedules/${code}`, {
    headers: AuthHeaders(),
  });
};

const deleteById = code => {
  return instance.put(`/schedules/delete/${code}`, {
    headers: AuthHeaders(),
  });
}

const ScheduleService = {
  getByID,
  getAll,
  deleteById,
  create,
  update,
  getSlots,
  getSubjectsByClassName,
  getByTeaccher
};

export default ScheduleService;