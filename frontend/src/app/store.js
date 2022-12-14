import { configureStore } from '@reduxjs/toolkit';
import messageReducer from '../features/message/message.slice';
import userReducer from '../features/user/user.slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
  },
  devTools: true,
});
