import instance from '../httpClient/axiosInstance';
import AuthHeaders from './AuthHeader';

const getReturnDefault = () => {
  return instance.get('/return-requests', {
    headers: AuthHeaders(),
  });
};
const getByID = assignId => {
  return instance.get(`/return-requests/${assignId}`, {
    headers: AuthHeaders(),
  });
};
const getListBySearchKey = (state, returnDate, searchKey) => {
  return instance.post(
    '/return-requests/search',
    { data: {} },
    {
      headers: AuthHeaders(),
      params: { state: state, returnDate: returnDate, searchKey: searchKey },
    }
  );
};

const RequestService = {
  getReturnDefault,
  getListBySearchKey,
  getByID,
};

export default RequestService;
