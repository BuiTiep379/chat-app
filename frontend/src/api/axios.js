import axios from 'axios';
const API_URL = 'http://localhost:3000/api';
const token = JSON.parse(localStorage.getItem('token'));
const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  },
});
axiosClient.interceptors.request.use((req) => {
  const token = JSON.parse(localStorage.getItem('token'));
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Add a response interceptor
axiosClient.interceptors.response.use(
  async (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    return Promise.reject(error);
  }
);
export default axiosClient;
