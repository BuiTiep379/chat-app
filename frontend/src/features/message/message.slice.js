import { createSlice, current } from '@reduxjs/toolkit';
import messageThunk from './message.service';

const initialState = {
  friends: [],
  messages: [],
  loading: false,
};
const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    socketSendMessage: (state, action) => {
      const messageData = action.payload;
      const { senderId, senderName, receiverId, time, message } = messageData;
      console.log('messageData', messageData);
      const initMessages = current(state.messages);
      console.log(typeof initMessages);
      const newMessages = [
        ...initMessages,
        {
          senderId,
          senderName,
          receiverId,
          createdAt: time,
          updatedAt: time,
          message: {
            text: message?.text,
            image: message?.image,
          },
        },
      ];
      state.messages = newMessages;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(messageThunk.getFriendsAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(messageThunk.getFriendsAPI.fulfilled, (state, action) => {
        state.friends = action.payload.list;
      })
      .addCase(messageThunk.getFriendsAPI.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(messageThunk.sendMessageAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(messageThunk.sendMessageAPI.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(messageThunk.sendMessageAPI.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(messageThunk.sendImageMessageAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(messageThunk.sendImageMessageAPI.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(messageThunk.sendImageMessageAPI.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(messageThunk.getMessageAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(messageThunk.getMessageAPI.fulfilled, (state, action) => {
        state.messages = action.payload.list;
      })
      .addCase(messageThunk.getMessageAPI.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

const messageReducer = messageSlice.reducer;
export const messageActions = messageSlice.actions;
export default messageReducer;
