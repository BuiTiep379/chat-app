import React from 'react';
import { useSelector } from 'react-redux';
const Message = (props) => {
  const { messages, currentFriend, scrollRef, typingMessage } = props;
  const user = useSelector((state) => state.user);
  return (
    <>
      <div className="message-show">
        {messages && messages.length > 0
          ? messages.map((item, index) => {
              if (item.senderId === user.info.id) {
                return (
                  <div ref={scrollRef} className="my-message" key={index}>
                    <div className="image-message">
                      <div className="my-text">
                        <p className="message-text">{item.message.text === '' ? <img alt="" src={item.message.image} /> : item.message.text}</p>
                      </div>
                    </div>
                    <div className="time">2 jun 2022</div>
                  </div>
                );
              } else {
                return (
                  <div ref={scrollRef} className="fd-message" key={index}>
                    <div className="image-message-time">
                      <img src={currentFriend.image} alt="" />
                      <div className="message-time">
                        <div className="fd-text">
                          <p className="message-text">{item.message.text === '' ? <img alt="" src={item.message.image} /> : item.message.text}</p>
                        </div>
                        <div className="time">2 jun 2022</div>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          : null}
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
