const { Response, Create, ServerError } = require('../utils/response');
const User = require('../models/user.model');
const Message = require('../models/message.model');
const cloudinary = require('../utils/cloudinary');

const getLastMessage = async (myId, friendId) => {
  const lastMessage = await Message.findOne({
    $and: [
      {
        senderId: { $in: [friendId, myId] },
        receiverId: { $in: [friendId, myId] },
      },
    ],
  })
    .sort({ updatedAt: -1 })
    .exec();
  return lastMessage;
};
const updateMessageStatus = (req, res) => {
  const messageData = req.body;
  Message.findByIdAndUpdate(messageData._id, { status: 'seen' })
    .then(() => {
      return Response(res);
    })
    .catch((error) => {
      return ServerError(res, error);
    });
};
const updateMessageDelivered = (req, res) => {
  const messageData = req.body;
  Message.findByIdAndUpdate(messageData._id, { status: 'delivered' })
    .then(() => {
      return Response(res);
    })
    .catch((error) => {
      return ServerError(res, error);
    });
};
const getFriends = async (req, res) => {
  const id = req.userId;
  let myFriends = [];
  const listFriend = await User.find({ _id: { $ne: id } });
  for (let i = 0; i < listFriend.length; i++) {
    let lastMessage = await getLastMessage(id, listFriend[i]._id);
    myFriends = [...myFriends, { friendInfo: listFriend[i], messageInfo: lastMessage }];
  }
  // const newList = listFriend.filter((item) => item._id != id);
  return Response(res, { list: myFriends });
};

const sendMessage = async (req, res) => {
  const messageData = req.body;
  const { senderId, senderName, receiverId, message } = messageData;
  const newMessage = new Message({
    senderId,
    senderName,
    receiverId,
    message: {
      text: message,
      image: '',
    },
  });
  newMessage.save((error, data) => {
    if (error) return ServerError(res, error.message);
    if (data) {
      return Create(res, {
        message: {
          senderId,
          senderName,
          receiverId,
          message,
          createdAt: data.createdAt,
          updatedAta: data.updatedAt,
        },
      });
    }
  });
};

const getMessage = async (req, res) => {
  const friendId = req.params.id;
  const myId = req.userId;

  const listMessage = await Message.find({
    $and: [
      {
        senderId: { $in: [friendId, myId] },
        receiverId: { $in: [friendId, myId] },
      },
    ],
  }).exec();

  return Response(res, { list: listMessage });
};
const sendImageMessage = async (req, res) => {
  const messageData = req.body;
  const { senderId, senderName, receiverId, image } = messageData;

  const uploadResponse = await cloudinary.uploader.upload(image, {
    folder: 'Images/MessageImage',
    resource_type: 'auto',
  });
  urlImage = uploadResponse.url;
  const newMessage = new Message({
    senderId,
    senderName,
    receiverId,
    message: {
      text: '',
      image: urlImage,
    },
  });
  newMessage.save((error, data) => {
    if (error) return ServerError(res, error.message);
    if (data) {
      return Create(res, {
        message: {
          senderId,
          senderName,
          receiverId,
          message: data.message,
          createdAt: data.createdAt,
          updatedAta: data.updatedAt,
        },
      });
    }
  });
};

module.exports = {
  getFriends,
  sendMessage,
  getMessage,
  sendImageMessage,
  updateMessageStatus,
  updateMessageDelivered,
};
