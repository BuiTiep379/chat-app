import React from 'react';
import moment from 'moment';
import { RiCheckboxCircleLine, RiCheckboxCircleFill } from 'react-icons/ri';
import avatar from '../assets/images/profile.png';
const ListFriend = (props) => {
  const { friend, myInfo, activeFriends } = props;
  const { friendInfo, messageInfo } = friend;
  const { image, username } = friendInfo;

  return (
    <div className="friend">
      <div className="friend-image">
        <div className="image">
          {image ? <img src={image} alt="avatar" /> : <img src={avatar} alt="avatar" />}

          {activeFriends && activeFriends.length > 0 && activeFriends.some((u) => u.userId === friendInfo._id) ? <div className="active_icon"></div> : ''}
        </div>
      </div>
      <div className="friend-name-seen">
        <div className="friend-name">
          <h4 className={messageInfo && messageInfo.senderId !== myInfo.id && messageInfo.status !== undefined && messageInfo.status !== 'seen' ? 'seen Fd_name' : 'unseen_message Fd_name'}>
            {username}
          </h4>
          <div className="msg-time">
            {messageInfo && messageInfo.message && messageInfo.senderId === myInfo.id ? (
              <span>Bạn </span>
            ) : (
              <span className={messageInfo && messageInfo.senderId !== myInfo.id && messageInfo.status !== undefined && messageInfo.status !== 'seen' ? 'unseen_message' : ''}>
                {friendInfo.username + ' '}
              </span>
            )}
            {messageInfo && messageInfo.message.text ? (
              <span>{messageInfo.message.text.slice(0, 10) + ' '}</span>
            ) : messageInfo && messageInfo.message.image ? (
              <span>Image </span>
            ) : (
              <span>Connect to you! </span>
            )}
            <span>{messageInfo ? moment(messageInfo.createdAt).startOf('mini').fromNow() : moment(friendInfo.createdAt).startOf('mini').fromNow()}</span>
          </div>
        </div>
        {messageInfo && myInfo.id === messageInfo?.senderId ? (
          <div className="seen-unseen-icon">
            {messageInfo.status === 'seen' ? (
              friendInfo ? (
                <img src={friendInfo.image} alt="" />
              ) : (
                <img src={avatar} alt="" />
              )
            ) : messageInfo.status === 'delivered' ? (
              <div className="delivered">
                <RiCheckboxCircleFill />
              </div>
            ) : messageInfo.status === 'unseen' ? (
              <div className="unseen">
                <RiCheckboxCircleLine />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="seen-unseen-icon">{messageInfo?.status !== undefined && messageInfo?.status !== 'seen' ? <div className="seen-icon"></div> : ''}</div>
        )}
      </div>
    </div>
  );
};

export default ListFriend;
