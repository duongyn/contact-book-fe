import instance from '../httpClient/axiosInstance';
import AuthHeaders from './AuthHeader';

const createReturnRequest = data => {
  return instance.post(`/return-requests`, data, {
    headers: AuthHeaders(),
  });
};

const isWaitForReturning = assignId => {
  return instance.get(`/return-requests/if-assign-waiting-return/${assignId}`, {
    headers: AuthHeaders(),
  });
};

const ReturnRequestService = {
  createReturnRequest,
  isWaitForReturning,
};

export default ReturnRequestService;
