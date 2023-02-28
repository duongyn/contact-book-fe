import axios from 'axios';
import { CONFIG } from './config';

const instance = axios.create({
  baseURL: CONFIG.baseUrl,
});

export default instance;
