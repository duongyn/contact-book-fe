import instance from '../httpClient/axiosInstance';
import AuthHeaders from './AuthHeader';
import { END_POINT } from '../httpClient/config';
import httpClient from '../httpClient/httpClient';
const getDefault = () => {
  return instance.get('/assets/default-set', {
    headers: AuthHeaders(),
  });
};

const getAll = () => {
  return instance.get('/subjects', {
    headers: AuthHeaders(),
  });
}

const getNonDefault = () => {
  return instance.get('/assets/sub-set', {
    headers: AuthHeaders(),
  });
};

const getByID = code => {
  return instance.get(`/subjects/${code}`, {
    headers: AuthHeaders(),
  });
};

const hasHistoricalAssigns = code => {
  return instance.get(`/assets/has-historical/${code}`, { headers: AuthHeaders() });
};

const hasWaitingAssigns = code => {
  return instance.get(`/assets/asset-has-waiting-accept-assign/${code}`, {
    headers: AuthHeaders(),
  });
};

const getValidAssetsForAssignment = () => {
  return httpClient.getValidAssetsForAssignment(END_POINT.getValidAssetsForAssignment);
};

const getValidAssetsForUpdateAssignment = assignmentId => {
  return httpClient.getValidAssetsForUpdateAssignment(
    END_POINT.getValidAssetsForUpdateAssignment + '/' + assignmentId
  );
};
const AssetService = {
  getDefault,
  getNonDefault,
  getByID,
  getValidAssetsForAssignment,
  hasHistoricalAssigns,
  getValidAssetsForUpdateAssignment,
  hasWaitingAssigns,
  getAll
};

export default AssetService;
