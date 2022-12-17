/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { BsThreeDots } from 'react-icons/bs';
import { IoEnterOutline } from 'react-icons/io5';
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
import avatar from '../assets/images/profile.png';
import { userActions } from '../features/user/user.slice';
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
  const { friends, messages, sendSuccess, getSuccess } = message;
  const [currentFriend, setCurrentFriend] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [listMessage, setListMessage] = useState(messages);
  const [listFriendActive, setListFriendActive] = useState([]);
  const [socketMessage, setSocketMessage] = useState('');
  const [typeingMessage, setTypeingMessage] = useState('');
  const [hide, setHide] = useState(true);
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
          socket.current.emit('typingMessage', {
            senderId: user.info.id,
            receiverId: currentFriend._id,
            msg: '',
          });
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
      .then((value) => {
        setNewMessage('');
        socket.current.emit('typingMessage', {
          senderId: user.info.id,
          receiverId: currentFriend._id,
          msg: '',
        });
      });
  };
  const handleSignOut = () => {
    dispatch(userActions.signout());
    socket.current.emit('signout', user.info.id);
  };
  const searchHandle = (e) => {
    console.log(e.target.value);
    const getFriendClass = document.getElementsByClassName('hover-friend');
    console.log(getFriendClass);
    const friendNameClass = document.getElementsByClassName('Fd_name');
    console.log(friendNameClass);
    for (let i = 0; i < getFriendClass.length, i < friendNameClass.length; i++) {
      let text = friendNameClass[i].innerText.toLowerCase();
      if (text.indexOf(e.target.value.toLowerCase()) !== -1) {
        getFriendClass[i].style.display = '';
      } else {
        getFriendClass[i].style.display = 'none';
      }
    }
  };
  useEffect(() => {
    socket.current = io('ws://localhost:8000');
    socket.current.on('getMessage', (data) => {
      setSocketMessage(data);
    });
    socket.current.on('getTypingMessage', (data) => {
      setTypeingMessage(data);
    });
    socket.current.on('messageSeenRes', (data) => {
      dispatch(messageActions.seenMessage(data));
    });
    socket.current.on('deliveredMessageRes', (data) => {
      console.log(data);
      dispatch(messageActions.deliveredMessage(data));
    });
    socket.current.on('seenSuccess', (data) => {
      dispatch(messageActions.seenAllMessage(data));
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
        // update status message
        dispatch(messageThunk.updateMessageStatusAPI(socketMessage));
        socket.current.emit('messageSeen', socketMessage);
        dispatch(
          messageActions.updateFriendMessage({
            messageData: socketMessage,
            status: 'seen',
          })
        );
      }
    }
    setSocketMessage('');
  }, [socketMessage]);
  useEffect(() => {
    if (socketMessage && socketMessage.senderId !== currentFriend._id && socketMessage.receiverId === user.info.id) {
      notificationSPlay();
      toast.success(`${socketMessage.senderName} đã gửi cho bạn một tin nhắn`);
      // update message socket
      socket.current.emit('deliveriedMessage', socketMessage);
      dispatch(messageThunk.updateMessaageDeliveredAPI(socketMessage))
        .unwrap()
        .then(() => {
          dispatch(
            messageActions.updateFriendMessage({
              messageData: socketMessage,
              status: 'delivered',
            })
          );
        });
    }
  }, [socketMessage]);

  useEffect(() => {
    if (sendSuccess) {
      dispatch(messageThunk.getMessageAPI(currentFriend._id))
        .unwrap()
        .then((value) => {
          socket.current.emit('sendMessage', value.list[value.list.length - 1]);
          setListMessage(value.list);
        });
    }
  }, [sendSuccess]);

  useEffect(() => {
    if (friends && friends.length > 0 && !currentFriend) {
      setCurrentFriend(friends[0].friendInfo);
    }
  }, [friends]);

  useEffect(() => {
    if (currentFriend) {
      dispatch(messageThunk.getMessageAPI(currentFriend._id))
        .unwrap()
        .then((value) => {
          if (value.list[value.list.length - 1].senderId !== user.info.id) {
            socket.current.emit('seen', {
              senderId: currentFriend._id,
              receiverId: user.info.id,
            });
            dispatch(messageThunk.updateMessageStatusAPI({ _id: value.list[value.list.length - 1]._id }))
              .unwrap()
              .then(() => {
                dispatch(messageActions.updateFriends(currentFriend._id));
                return dispatch(messageThunk.getMessageAPI(currentFriend._id)).unwrap();
              })
              .then((value) => {
                setListMessage(value.list);
              });
          }
        });
    }
  }, [currentFriend]);
  useEffect(() => {
    if (Object.keys(messages).length !== 0) {
      setListMessage(messages);
    }
  }, [messages]);

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
                    <div className="image">{user.info.image ? <img src={user.info.image} alt="avatar" /> : <img src={avatar} alt="avatar" />}</div>
                    <div className="name">
                      <h3>{user.info.username}</h3>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="icons">
                <div className="icon" onClick={handleSignOut}>
                  <IoEnterOutline />
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
                  <InputBase onChange={searchHandle} sx={{ ml: 1, flex: 1, fontSize: '14px', paddingLeft: '10px' }} placeholder="Tìm kiếm..." />
                  <IconButton type="button" sx={{ p: '10px' }}>
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Stack>
            </div>

            {/* <div className="active-friends">
              {listFriendActive && listFriendActive.length > 0
                ? listFriendActive.map((item, index) => {
                    return <ActiveFriends user={item} key={index} setCurrentFriend={setCurrentFriend} />;
                  })
                : null}
            </div> */}
            <div className="friends">
              {friends && friends.length > 0
                ? friends.map((item, index) => {
                    return (
                      <div className={currentFriend._id === item.friendInfo._id ? 'hover-friend active' : 'hover-friend'} key={index} onClick={() => setCurrentFriend(item.friendInfo)}>
                        <ListFriend friend={item} myInfo={user.info} activeFriends={listFriendActive} />
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
