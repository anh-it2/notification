// NotificationCard.jsx
import React, { forwardRef } from 'react';
import { LuUser } from 'react-icons/lu';

const NotificationCard = forwardRef(({ message }, ref) => {
  return (
    <div className="notificationCard" ref={ref}>
      {message.image ? <img src={message.image} alt="notification" /> : <LuUser />}
      <div>
        <div className="title">{message.title}</div>
        <div className="body">{message.body}</div>
      </div>
    </div>
  );
});

export default NotificationCard;
