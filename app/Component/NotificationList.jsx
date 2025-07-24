'use client'

import React from 'react'
import NotificationCard from './NotificationCard'

const NotificationList = ({ notify, lastNotifyRef }) => {
  return (
    <div className='notificationList'>
      {notify.map((message, index) => {
        return (
          <NotificationCard
            message={message}
            key={index}
            ref={el => {
              if(index === notify.length - 1){
                lastNotifyRef(el)
              }
            }}
          />
        );
      })}
    </div>
  )
}

export default NotificationList;
