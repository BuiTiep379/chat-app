/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { BsThreeDots } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';
import SearchIcon from '@mui/icons-material/Search';
import { Stack, Paper, IconButton, InputBase } from '@mui/material';
import ActiveFriends from './ActiveFriends';
import ListFriend from './ListFriend';
import RightSide from './RightSide';
import messageThunk from '../features/message/message.service';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { messageActions } from '../features/message/message.slice';
import useSound from 'use-sound';
import notificationSound from '../assets/audio/SMSIPhoneRingtone.mp3';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef();
  const socket = useRef();

  const message = useSelector((state) => state.message);
  const user = useSelector((state) => state.user);
  const { friends, messages } = message;
  const [currentFriend, setCurrentFriend] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [listMessage, setListMessage] = useState(messages);
  const [listFriendActive, setListFriendActive] = useState([]);
  const [socketMessage, setSocketMessage] = useState('');
  const [typeingMessage, setTypeingMessage] = useState('');
  const [notificationSPlay] = useSound(notificationSound);
  const inputHandleChange = (e) => {
    setNewMessage(e.target.value);
    if (e.target.value !== '') {
      socket.current.emit('typingMessage', {
        senderId: user.info.id,
        receiverId: currentFriend._id,
        msg: e.target.value,
      });
    } else {
      socket.current.emit('typingMessage', {
        senderId: user.info.id,
        receiverId: currentFriend._id,
        msg: '',
      });
    }
  };
  const emojiSend = (emo) => {
    setNewMessage(`${newMessage}` + emo);
    if (emo !== '') {
      socket.current.emit('typingMessage', {
        senderId: user.info.id,
        receiverId: currentFriend._id,
        msg: emo,
      });
    } else {
      socket.current.emit('typingMessage', {
        senderId: user.info.id,
        receiverId: currentFriend._id,
        msg: '',
      });
    }
  };
  const imageSend = async (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      const image = await getBase64(file);
      const messageData = {
        senderId: user.info.id,
        senderName: user.info.username,
        receiverId: currentFriend._id,
        image,
      };

      dispatch(messageThunk.sendImageMessageAPI(messageData))
        .unwrap()
        .then((value) => {
          setNewMessage('');
          const messageData = {
            senderId: user.info.id,
            senderName: user.info.username,
            receiverId: currentFriend._id,
            time: new Date(),
            message: {
              text: '',
              image: value.message.message.image,
            },
          };
          socket.current.emit('sendMessage', messageData);
          socket.current.emit('typingMessage', {
            senderId: user.info.id,
            receiverId: currentFriend._id,
            msg: '',
          });
          return dispatch(messageThunk.getMessageAPI(currentFriend._id)).unwrap();
        })
        .then((value) => {
          setListMessage(value.list);
        });
    }
  };
  const sendMessage = (e) => {
    e.preventDefault();

    const messageData = {
      senderId: user.info.id,
      senderName: user.info.username,
      receiverId: currentFriend._id,
      message: newMessage === '' ? '👍' : newMessage,
    };
    dispatch(messageThunk.sendMessageAPI(messageData))
      .unwrap()
      .then(() => {
        setNewMessage('');
        return dispatch(messageThunk.getMessageAPI(currentFriend._id)).unwrap();
      })
      .then((value) => {
        const messageData = {
          senderId: user.info.id,
          senderName: user.info.username,
          receiverId: currentFriend._id,
          time: new Date(),
          message: {
            text: newMessage === '' ? '👍' : newMessage,
            image: '',
          },
        };
        socket.current.emit('typingMessage', {
          senderId: user.info.id,
          receiverId: currentFriend._id,
          msg: '',
        });
        console.log(messageData);
        socket.current.emit('sendMessage', messageData);
        setListMessage(value.list);
      });
  };
  useEffect(() => {
    socket.current = io('ws://localhost:8000');
    socket.current.on('getMessage', (data) => {
      setSocketMessage(data);
    });
    socket.current.on('getTypingMessage', (data) => {
      setTypeingMessage(data);
    });
  }, [socket]);
  useEffect(() => {
    if (user.info) {
      socket.current.emit('addUser', user.info.id, user.info);
    }
  }, [user]);
  useEffect(() => {
    if (user.info) {
      socket.current.on('getUser', (users) => {
        const newListUser = users.filter((u) => u.userId !== user.info.id);
        setListFriendActive(newListUser);
      });
    }
  }, [user.info, socket]);
  useEffect(() => {
    if (socketMessage && currentFriend) {
      if (socketMessage.senderId === currentFriend._id && socketMessage.receiverId === user.info.id) {
        dispatch(messageActions.socketSendMessage(socketMessage));
        dispatch(messageThunk.getMessageAPI(currentFriend._id))
          .unwrap()
          .then((value) => {
            setListMessage(value.list);
          });
      }
    }
    setSocketMessage('');
  }, [socketMessage, currentFriend, dispatch, user.info]);
  useEffect(() => {
    if (socketMessage && socketMessage.senderId !== currentFriend._id && socketMessage.receiverId === user.info.id) {
      notificationSPlay();
      toast.success(`${socketMessage.senderName} đã gửi cho bạn một tin nhắn`);
    }
  }, [socketMessage]);

  useEffect(() => {
    if (friends && friends.length > 0) {
      setCurrentFriend(friends[0].friendInfo);
    }
  }, [friends]);
  useEffect(() => {
    if (currentFriend) {
      dispatch(messageThunk.getMessageAPI(currentFriend._id))
        .unwrap()
        .then((value) => {
          setListMessage(value.list);
        });
    }
  }, [dispatch, currentFriend]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [listMessage]);

  return (
    <div className="messenger">
      <Toaster
        position={'top-right'}
        reverseOrder={false}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#2ecc40',
            color: '#fff',
            fontSize: '14px',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <div className="row">
        <div className="col-3">
          <div className="left-side">
            <div className="top">
              {/* image-and-name */}
              <div className="image-name">
                {user.info ? (
                  <>
                    <div className="image">
                      <img src={user.info.image} alt="avatar" />
                    </div>
                    <div className="name">
                      <h3>{user.info.username}</h3>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="icons">
                <div className="icon">
                  <BsThreeDots />
                </div>
                <div className="icon">
                  <FaEdit />
                </div>
              </div>
            </div>
            <div className="friend-search">
              <Stack direction="row" display="flex" justifyContent="center" alignItems="center" spacing={3}>
                <Paper
                  component="form"
                  sx={{
                    display: 'flex',
                    width: '100%',
                    borderRadius: '50px',
                  }}
                  variant="outlined"
                >
                  <InputBase sx={{ ml: 1, flex: 1, fontSize: '14px', paddingLeft: '10px' }} placeholder="Tìm kiếm..." />
                  <IconButton type="button" sx={{ p: '10px' }}>
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Stack>
            </div>

            <div className="active-friends">
              {listFriendActive && listFriendActive.length > 0
                ? listFriendActive.map((item, index) => {
                    return <ActiveFriends user={item} key={index} setCurrentFriend={setCurrentFriend} />;
                  })
                : null}
            </div>
            <div className="friends">
              {friends && friends.length > 0
                ? friends.map((item, index) => {
                    return (
                      <div className={currentFriend._id === item.friendInfo._id ? 'hover-friend active' : 'hover-friend'} key={index} onClick={() => setCurrentFriend(item.friendInfo)}>
                        <ListFriend friend={item} myInfo={user.info} />
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
        {currentFriend ? (
          <RightSide
            activeFriends={listFriendActive}
            scrollRef={scrollRef}
            emojiSend={emojiSend}
            friend={currentFriend}
            newMessage={newMessage}
            inputHandleChange={inputHandleChange}
            sendMessage={sendMessage}
            messages={listMessage}
            imageSend={imageSend}
            typingMessage={typeingMessage}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Home;
