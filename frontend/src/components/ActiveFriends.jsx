import React from 'react';
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
          <img src={user.userInfo.image} alt="avatar" />
          <div className="active-icon"></div>
        </div>
      </div>
    </div>
  );
};

export default ActiveFriends;
