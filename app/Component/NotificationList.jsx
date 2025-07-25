'use client'

import React from 'react'
import NotificationCard from './NotificationCard'

const NotificationList = ({ notify, setNotify, lastNotifyRef, setUnReadNotify, loading }) => {
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
              setUnReadNotify={setUnReadNotify}
              onMarkAsRead={(id) => {
                setNotify((prev) => {
                  return prev.map((item) =>{
                     return item.id === id ? {...item,read: true}: item
                  })
                })
              }
              }
            />
        );
      })}
      {loading&& <div className='spinner middle'></div>}
    </div>
  )
}

export default NotificationList;
