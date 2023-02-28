import instance from '../httpClient/axiosInstance';
import AuthHeaders from './AuthHeader';

const getAll = () => {
  return instance.get('/categories', {
    headers: AuthHeaders(),
  });
};

const CategoryService = {
  getAll,
};

export default CategoryService;
