import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axios';

const getFriendsAPI = createAsyncThunk('get-friends', async (thunkAPI) => {
  try {
    const response = await axiosClient.get('/message/get-friends', { withCredentials: true });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const sendMessageAPI = createAsyncThunk('send-message', async (messageData, thunkAPI) => {
  try {
    const response = await axiosClient.post('/message/send-message', messageData, { withCredentials: true });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
const sendImageMessageAPI = createAsyncThunk('send-image', async (messageData, thunkAPI) => {
  try {
    const response = await axiosClient.post('/message/send-image', messageData, { withCredentials: true });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const getMessageAPI = createAsyncThunk('get-message', async (currentFriendId, thunkAPI) => {
  try {
    const response = await axiosClient.get(`/message/get-message/${currentFriendId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const updateMessageStatusAPI = createAsyncThunk('update-status-message', async (messageData, thunkAPI) => {
  try {
    const response = await axiosClient.post('/message/update-status', messageData, { withCredentials: true });
    console.log(response);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
const updateMessaageDeliveredAPI = createAsyncThunk('update-message-delivered', async (messageData, thunkAPI) => {
  try {
    const response = await axiosClient.post('/message/update-message-delivered', messageData, { withCredentials: true });
    console.log(response);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
const messageThunk = {
  getFriendsAPI,
  sendMessageAPI,
  getMessageAPI,
  sendImageMessageAPI,
  updateMessageStatusAPI,
  updateMessaageDeliveredAPI,
};

export default messageThunk;
