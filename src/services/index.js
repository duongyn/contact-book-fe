import httpClient from '../httpClient/httpClient';
import { END_POINT } from '../httpClient/config';
export const authenticate = data => {
  return httpClient.login(`${END_POINT.login}`, data);
};

export const updatePasswordFirstTime = data => {
  return httpClient.updatePasswordFirstTime(END_POINT.updatePasswordFirstTime, data);
};

export const disableUser = data => {
  return httpClient.disableUser(END_POINT.disableUser + `/${data}`);
};

export const checkUser = data => {
  return httpClient.checkUser(END_POINT.checkUser, data);
};

export const changePassword = data => {
  return httpClient.changePassword(END_POINT.changePassword, data);
};

export const checkPassword = data => {
  return httpClient.checkPassword(END_POINT.checkPassword, data);
};
