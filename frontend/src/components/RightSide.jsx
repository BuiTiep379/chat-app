import React from 'react';
import avatar from '../assets/images/2.jpg';
import { IoCall } from 'react-icons/io5';
import { BsCameraVideoFill } from 'react-icons/bs';
import { HiDotsCircleHorizontal } from 'react-icons/hi';
import Message from './Message';
import MessageSend from './MessageSend';
import FriendInfo from './FriendInfo';

const RightSide = (props) => {
  const { friend, inputHandleChange, newMessage, sendMessage, messages, scrollRef, emojiSend, imageSend, activeFriends, typingMessage } = props;
  console.log(friend);
  const { username, image } = friend;
  return (
    <div className="col-9">
      <div className="right-side">
        <input type="checkbox" name="dot" id="dot" />
        <div className="row">
          <div className="col-8">
            <div className="message-send-show">
              <div className="header">
                <div className="image-name">
                  <div className="image">
                    <img src={image} alt="" />
                    {activeFriends && activeFriends.length > 0 && activeFriends.some((u) => u.userId === friend._id) ? <div className="active-icon"></div> : null}
                  </div>
                  <div className="name">
                    <h3>{username}</h3>
                  </div>
                </div>
                <div className="icons">
                  <div className="icon">
                    <IoCall />
                  </div>
                  <div className="icon">
                    <BsCameraVideoFill />
                  </div>
                  <div className="icon">
                    <label htmlFor="dot">
                      {' '}
                      <HiDotsCircleHorizontal />
                    </label>
                  </div>
                </div>
              </div>
              <Message typingMessage={typingMessage} messages={messages} currentFriend={friend} scrollRef={scrollRef} />
              <MessageSend inputHandleChange={inputHandleChange} newMessage={newMessage} sendMessage={sendMessage} emojiSend={emojiSend} imageSend={imageSend} />
            </div>
          </div>
          <div className="col-4">
            <FriendInfo currentFriend={friend} activeFriends={activeFriends} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
