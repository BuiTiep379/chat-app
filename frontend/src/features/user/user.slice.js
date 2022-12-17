import { createSlice } from '@reduxjs/toolkit';
import userThunk from './user.service';
import jwt_decode from 'jwt-decode';

const decodeToken = (token) => {
  const decode = jwt_decode(token);
  const expTime = new Date(decode.exp * 1000);
  if (new Date() > expTime) {
    return null;
  }
  return decode;
};

const initialState = {
  token: null,
  info: null,
  isLoggedIn: false,
  logging: false,
  error: null,
  message: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.message = '';
      state.error = null;
    },
    signout: (state) => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      state.isLoggedIn = false;
      state.info = null;
    },
    isUserLoggedIn: {
      reducer: (state, action) => {
        const { userData, token } = action.payload;
        state.logging = false;
        state.info = userData;
        state.token = token;

        if (!token || !userData) {
          state.isLoggedIn = false;
        } else {
          state.isLoggedIn = true;
        }
      },
      prepare: () => {
        const token = JSON.parse(localStorage.getItem('token'));

        if (!token) {
          return { payload: { userData: null, token: null } };
        } else {
          const user = decodeToken(token);
          return { payload: { userData: user, token: token } };
        }
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userThunk.loginAPI.pending, (state) => {
        state.logging = true;
      })
      .addCase(userThunk.loginAPI.fulfilled, (state, action) => {
        state.logging = false;
        state.token = action.payload.token;
        state.info = decodeToken(action.payload.token);
        localStorage.setItem('token', JSON.stringify(action.payload.token));
        localStorage.setItem('user', JSON.stringify(decodeToken(action.payload.token)));
        state.isLoggedIn = true;
        state.logging = false;
      })
      .addCase(userThunk.loginAPI.rejected, (state, action) => {
        state.error = true;
        state.logging = false;
        state.message = action.payload;
      });
  },
});

const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
export default userReducer;
