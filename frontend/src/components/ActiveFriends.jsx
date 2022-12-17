import React from 'react';
import avatar from '../assets/images/profile.png';
const ActiveFriends = (props) => {
  const { user, setCurrentFriend } = props;
  return (
    <div
      className="active-friends"
      onClick={() =>
        setCurrentFriend({
          _id: user.userId,
          email: user.userInfo.email,
          image: user.userInfo.image,
          username: user.userInfo.username,
        })
      }
    >
      <div className="image-active-icon">
        <div className="image">
          {user.userInfo.image ? <img src={user.userInfo.image} alt="avatar" /> : <img src={avatar} alt="avatar" />}

          <div className="active-icon"></div>
        </div>
      </div>
    </div>
  );
};

export default ActiveFriends;
