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
    const user = findFriend(data.receiverId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('getMessage', data);
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
  socket.on('disconnect', () => {
    console.log('user disconnect....');
    removeUser(socket.id);
    io.emit('getUser', users);
  });
});
