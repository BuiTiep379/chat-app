import React from 'react';
import moment from 'moment';
const ListFriend = (props) => {
  const { friend, myInfo } = props;
  console.log(friend);
  const { friendInfo, messageInfo } = friend;
  const { image, username } = friendInfo;
  console.log(messageInfo);
  console.log(myInfo);
  return (
    <div className="friend">
      <div className="friend-image">
        <div className="image">
          <img src={image} alt="avatar" />
        </div>
      </div>
      <div className="friend-name-seen">
        <div className="friend-name">
          <h4>{username}</h4>
          <div className="msg-time">
            {messageInfo && messageInfo.message && messageInfo.senderId === myInfo.id ? <span>Bạn </span> : <span>{friendInfo.username + ' '}</span>}
            {messageInfo && messageInfo.message.text ? (
              <span>{messageInfo.message.text.slice(0, 10) + ' '}</span>
            ) : messageInfo && messageInfo.message.image ? (
              <span>Hình ảnh </span>
            ) : (
              <span>Làm quen nào! </span>
            )}
            <span>{messageInfo ? moment(messageInfo.createdAt).startOf('mini').fromNow() : moment(friendInfo.createdAt).startOf('mini').fromNow()}</span>
          </div>
        </div>
        {myInfo.id === messageInfo?.senderId ? (
          <div className="seen-unseen-icon">
            <img src={friendInfo.image} alt="" />
          </div>
        ) : (
          <div className="seen-unseen-icon">
            <div className="seen-icon"></div>{' '}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListFriend;
