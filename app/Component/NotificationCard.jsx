// NotificationCard.jsx
import React, { forwardRef } from 'react';
import { LuUser } from 'react-icons/lu';

const NotificationCard = forwardRef(({ message, setUnReadNotify, onMarkAsRead }, ref) => {

  const handleClickNotify = async (id) =>{
  if(message.read === false){
    setUnReadNotify((count) => count - 1)

    await fetch('api/markAsRead',{
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    })

    onMarkAsRead(id)
  }
}

  return (
    <div className={`notificationCard ${message.read ? 'read' : 'unread'}`} ref={ref} onClick={() => handleClickNotify(message.id)}>
      <div className='circle'></div>
      {message.image ? <img src={message.image} alt="notification" className='image'/> : <LuUser className='icon-user'/>}
      <div>
        <div className="title">{message.title}</div>
        <div className="body">{message.body}</div>
      </div>
    </div>
  );
});

export default NotificationCard;
