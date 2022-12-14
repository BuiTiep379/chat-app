import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axios';

const registerAPI = createAsyncThunk('register', async (userData, thunkAPI) => {
  try {
    const response = await axiosClient.post('/auth/register', userData);
    console.log(response);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
const loginAPI = createAsyncThunk('login', async (userData, thunkAPI) => {
  try {
    const response = await axiosClient.post('/auth/login', userData, {
      withCredentials: true,
      credentials: 'include',
    });
    console.log(response);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
const userThunk = {
  registerAPI,
  loginAPI,
};

export default userThunk;
