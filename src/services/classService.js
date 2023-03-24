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

const getValidTeachers = () => {
  return instance.get('/classes/get-valid-teachers', {
    headers: AuthHeaders()
  })
}

const getValidStudents = () => {
  return instance.get('/classes/get-valid-students', {
    headers: AuthHeaders()
  })
}

const getByID = id => {
  return instance.get(`/classes/${id}`, {
    headers: AuthHeaders(),
  });
};

const deleteClass = id => {
  return instance.put(`/classes/delete/${id}`, { headers: AuthHeaders() });
};

const createStudentList = data => {
  return instance.put('classes/db-to-excel',data, {
    responseType: 'blob', headers: AuthHeaders()
  });
}

const ClassService = {
  getDefault,
  getByID,
  getListBySearchKey,
  deleteClass,
  getValidTeachers,
  createStudentList,
  getValidStudents
};

export default ClassService;
