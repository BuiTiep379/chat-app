import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import avatar from '../assets/images/profile.png';
import { RiCheckboxCircleLine, RiCheckboxCircleFill } from 'react-icons/ri';
const Message = (props) => {
  const { messages, currentFriend, scrollRef, typingMessage } = props;
  const user = useSelector((state) => state.user);
  return (
    <>
      <div className="message-show">
        {messages && messages.length > 0 ? (
          messages.map((item, index) => {
            if (item.senderId === user.info.id) {
              if (index === messages.length - 1) {
                return (
                  <div ref={scrollRef} className="my-message" key={index}>
                    <div className="image-message">
                      <div className="my-text">
                        <p className="message-text">{item.message.text === '' ? <img alt="" src={item.message.image} /> : item.message.text}</p>
                        {item.status === 'seen' ? (
                          <img alt="" src={currentFriend.image} className="img" />
                        ) : item.status === 'delivered' ? (
                          <span>
                            <RiCheckboxCircleFill />
                          </span>
                        ) : item.status === 'unseen' ? (
                          <span>
                            <RiCheckboxCircleLine />
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="time">
                      <p>{moment(item.createdAt).startOf('mini').fromNow()}</p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div ref={scrollRef} className="my-message" key={index}>
                    <div className="image-message">
                      <div className="my-text">
                        <p className="message-text">{item.message.text === '' ? <img alt="" src={item.message.image} /> : item.message.text}</p>
                      </div>
                    </div>
                    {/* <div className="time">
                      <p>{moment(item.createdAt).startOf('mini').fromNow()}</p>
                    </div> */}
                  </div>
                );
              }
            } else {
              if (index === messages.length - 1) {
                return (
                  <div ref={scrollRef} className="fd-message" key={index}>
                    <div className="image-message-time">
                      {currentFriend.image ? <img src={currentFriend.image} alt="" /> : <img src={avatar} alt="" />}
                      {/* <img src={currentFriend.image} alt="" /> */}
                      <div className="message-time">
                        <div className="fd-text">
                          <p className="message-text">{item.message.text === '' ? <img alt="" src={item.message.image} /> : item.message.text}</p>
                        </div>
                        <div className="time">
                          <p>{moment(item.createdAt).startOf('mini').fromNow()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div ref={scrollRef} className="fd-message" key={index}>
                    <div className="image-message-time">
                      {currentFriend.image ? <img src={currentFriend.image} alt="" /> : <img src={avatar} alt="" />}
                      {/* <img src={currentFriend.image} alt="" /> */}
                      <div className="message-time">
                        <div className="fd-text">
                          <p className="message-text">{item.message.text === '' ? <img alt="" src={item.message.image} /> : item.message.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            }
          })
        ) : (
          <div className="friend-connect">
            <img src={currentFriend.image} alt="" />
            <h3>{currentFriend.username} đã tham gia</h3>
            <span>{moment(currentFriend.createdAt).startOf('mini').fromNow()}</span>
          </div>
        )}
      </div>
      {typingMessage && typingMessage.msg !== '' && typingMessage.senderId === currentFriend._id ? (
        <div className="typing-message">
          <div className="fd-message">
            <div className="image-message-time">
              <img src={currentFriend.image} alt="" />
              <div className="message-time">
                <div className="fd-text">
                  <p className="message-text">Typing message....</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Message;
