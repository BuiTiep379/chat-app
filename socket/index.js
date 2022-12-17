const io = require('socket.io')(8000, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let users = [];

const addUser = (userId, socketId, userInfo) => {
  const checkUser = users.some((u) => u.userId === userId);

  if (!checkUser) {
    users.push({ userId, socketId, userInfo });
  }
};
const removeUser = (socketId) => {
  const newListUser = users.filter((u) => u.socketId !== socketId);
  users = newListUser;
};
const userLogout = (userId) => {
  users = users.filter((u) => u.userId !== userId);
};
const findFriend = (id) => {
  let friend = {};
  users.map((user) => {
    if (user.userId === id) {
      friend = user;
    }
  });
  return friend;
};
io.on('connection', (socket) => {
  console.log('user is connected.....');
  socket.on('addUser', (userId, userInfo) => {
    addUser(userId, socket.id, userInfo);
    io.emit('getUser', users);

    // const us = users.filter((u) => u.userId !== userId);
    // const con = 'new_user_add';
    // for (var i = 0; i < us.length; i++) {
    //   socket.to(us[i].socketId).emit('new_user_add', con);
    // }
  });
  socket.on('sendMessage', (data) => {
    console.log(data);
    const user = findFriend(data.receiverId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('getMessage', data);
    }
  });
  socket.on('deliveriedMessage', (data) => {
    const user = findFriend(data.senderId);
    if (user !== undefined) {
      console.log('chay');
      socket.to(user.socketId).emit('deliveredMessageRes', data);
    }
  });
  socket.on('messageSeen', (data) => {
    const user = findFriend(data.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('messageSeenRes', data);
    }
  });
  socket.on('seen', (data) => {
    console.log(data);
    const user = findFriend(data.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('seenSuccess', data);
    }
  });
  socket.on('typingMessage', (data) => {
    const user = findFriend(data.receiverId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('getTypingMessage', {
        senderId: data.senderId,
        receiverId: data.receiverId,
        msg: data.msg,
      });
    }
  });
  socket.on('signout', (userId) => {
    removeUser(userId);
  });
  socket.on('disconnect', () => {
    console.log('user disconnect....');
    userLogout(socket.id);
    io.emit('getUser', users);
  });
});
