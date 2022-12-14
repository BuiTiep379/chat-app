import React from 'react';
import { BsPlusCircle } from 'react-icons/bs';
import { RiGalleryLine } from 'react-icons/ri';
import { BiMessageAltEdit } from 'react-icons/bi';
import { AiFillGift } from 'react-icons/ai';
import { AiOutlineSend, AiOutlineLike } from 'react-icons/ai';
const listEmoji = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '🫠', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'];
const MessageSend = (props) => {
  const { newMessage, inputHandleChange, sendMessage, emojiSend, imageSend } = props;
  return (
    <div className="message-send-section">
      <input type="checkbox" id="emoji" />
      <div className="file hover-attachment">
        <div className="add-attachment">Add Attachment</div>
        <BsPlusCircle />
      </div>
      <div className="file hover-image">
        <div className="add-image">Add Image</div>
        <input onChange={imageSend} type="file" id="pic" className="form-control" />
        <label htmlFor="pic">
          <RiGalleryLine />
        </label>
      </div>
      <div className="file">
        <BiMessageAltEdit />
      </div>
      <div className="file hover-gift">
        <div className="add-gift">Add gift</div>
        <AiFillGift />
      </div>
      <div className="message-type">
        <input type="text" name="message" id="message" placeholder="Aa" className="form-control" value={newMessage} onChange={inputHandleChange} />
        <label htmlFor="emoji">🙂</label>
      </div>
      <div className="file" onClick={sendMessage}>
        {newMessage !== '' ? (
          <label>
            <AiOutlineSend />
          </label>
        ) : (
          <label>
            <AiOutlineLike />
          </label>
        )}
      </div>
      <div className="emoji-section">
        <div className="emoji">
          {listEmoji.map((e, index) => (
            <span key={index} onClick={() => emojiSend(e)}>
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageSend;
