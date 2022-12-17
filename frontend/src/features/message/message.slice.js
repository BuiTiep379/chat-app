import { createSlice, current } from '@reduxjs/toolkit';
import messageThunk from './message.service';

const initialState = {
  friends: [],
  messages: [],
  loading: false,
  getSuccess: false,
  sendSuccess: false,
};
const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    socketSendMessage: (state, action) => {
      const messageData = action.payload;
      const { senderId, senderName, receiverId, time, message } = messageData;
      const initMessages = current(state.messages);
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
    seenMessage: (state, action) => {
      const messageData = action.payload;
      const indexFriend = state.friends.findIndex((friend) => friend.friendInfo._id === messageData.receiverId || friend.friendInfo._id === messageData.senderId);
      state.friends[indexFriend].messageInfo.status = 'seen';
      state.messages[state.messages.length - 1].status = 'seen';
    },
    deliveredMessage: (state, action) => {
      const messageData = action.payload;
      const indexFriend = state.friends.findIndex((friend) => friend.friendInfo._id === messageData.receiverId || friend.friendInfo._id === messageData.senderId);
      state.friends[indexFriend].messageInfo.status = 'delivered';
      state.messages[state.messages.length - 1].status = 'delivered';
    },
    updateFriendMessage: (state, action) => {
      const { messageData, status } = action.payload;
      const indexFriend = state.friends.findIndex((friend) => friend.friendInfo._id === messageData.receiverId || friend.friendInfo._id === messageData.senderId);
      state.friends[indexFriend].messageInfo = {
        ...messageData,
        status,
      };
      state.messages[state.messages.length - 1].status = status;
    },
    updateFriends: (state, action) => {
      const id = action.payload;
      const indexFriend = state.friends.findIndex((friend) => friend.friendInfo._id === id);
      if (state.friends[indexFriend].messageInfo) {
        state.friends[indexFriend].messageInfo.status = 'seen';
      }
    },
    seenAllMessage: (state, action) => {
      const { senderId, receiverId } = action.payload;
      const indexFriend = state.friends.findIndex((friend) => friend.friendInfo._id === receiverId);
      state.friends[indexFriend].messageInfo.status = 'seen';
      state.messages[state.messages.length - 1].status = 'seen';
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
        state.sendSuccess = false;
      })
      .addCase(messageThunk.sendMessageAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.sendSuccess = true;
      })
      .addCase(messageThunk.sendMessageAPI.rejected, (state, action) => {
        state.loading = false;
        state.sendSuccess = false;
      })
      .addCase(messageThunk.sendImageMessageAPI.pending, (state) => {
        state.sendSuccess = false;
        state.loading = true;
      })
      .addCase(messageThunk.sendImageMessageAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.sendSuccess = true;
      })
      .addCase(messageThunk.sendImageMessageAPI.rejected, (state, action) => {
        state.sendSuccess = false;
        state.loading = false;
      })
      .addCase(messageThunk.getMessageAPI.pending, (state) => {
        state.loading = true;
        state.getSuccess = false;
      })
      .addCase(messageThunk.getMessageAPI.fulfilled, (state, action) => {
        state.messages = action.payload.list;
        state.getSuccess = true;
      })
      .addCase(messageThunk.getMessageAPI.rejected, (state, action) => {
        state.loading = false;
        state.getSuccess = false;
      })
      .addCase(messageThunk.updateMessageStatusAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(messageThunk.updateMessageStatusAPI.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(messageThunk.updateMessageStatusAPI.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(messageThunk.updateMessaageDeliveredAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(messageThunk.updateMessaageDeliveredAPI.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(messageThunk.updateMessaageDeliveredAPI.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

const messageReducer = messageSlice.reducer;
export const messageActions = messageSlice.actions;
export default messageReducer;
