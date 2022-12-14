import React from 'react';
import avatar from '../assets/images/2.jpg';
import { BsChevronDown } from 'react-icons/bs';
const FriendInfo = (props) => {
  const { currentFriend, activeFriends } = props;
  const { username, image } = currentFriend;
  return (
    <div className="friend-info">
      <input type="checkbox" id="gallery" name="gallery" />
      <div className="image-name">
        <div className="image">
          <img src={image} alt="" />
        </div>
        {activeFriends && activeFriends.length > 0 && activeFriends.some((u) => u.userId === currentFriend._id) ? <div className="active-user">Hoạt động</div> : null}

        <div className="name">
          <h4>{username}</h4>
        </div>
      </div>
      <div className="others">
        <div className="custom-chat">
          <h3>Customise Chat</h3>
          <BsChevronDown />
        </div>
        <div className="privacy">
          <h3>Private and support</h3>
          <BsChevronDown />
        </div>
        <div className="media">
          <h3>share media</h3>
          <label htmlFor="gallery">
            {' '}
            <BsChevronDown />
          </label>
        </div>
      </div>
      <div className="gallery">
        <img src={avatar} alt="" />
        <img src={avatar} alt="" />
        <img src={avatar} alt="" />
        <img src={avatar} alt="" />
        <img src={avatar} alt="" />
        <img src={avatar} alt="" />
        <img src={avatar} alt="" />
      </div>
    </div>
  );
};

export default FriendInfo;
