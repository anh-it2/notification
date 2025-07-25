'use client'

import { app, db } from "@/lib/Firebase";
import{getMessaging, getToken, onMessage} from 'firebase/messaging'
import { useCallback, useEffect, useRef, useState } from "react";
import NotificationList from "./Component/NotificationList";
import { collection, onSnapshot } from "firebase/firestore";
import { MdNotificationsActive } from "react-icons/md";

export default function Home() {

  const observer = useRef()
  const scrollContainer = useRef()
  const countRef = useRef(-1)

  const [notify, setNotify] = useState([])
  const [lastDoc, setLastDoc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [show, setShow] = useState(false)
  const [unReadNotify, setUnReadNotify] = useState(0)

  const fetchData = async (lastDoc) => {

    if(!hasMore || loading) return 

    setLoading(true)

    const res = await fetch(`${self.location.origin}/api/fetchNotification`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        lastDoc: lastDoc
      })
    })

    const json = await res.json()
    const data = json.data
    console.log(json.hasMore)

    if(!json.hasMore){
      setHasMore(false)
    }else{
      setLastDoc(json.lastDoc)
    }
    if(lastDoc === null){
       setNotify(data)
    }else{
       setNotify((prev) => [...prev,...data])
    }

    setUnReadNotify(json.unReadNoti)

    console.log(notify)
    setLoading(false)
  }

  useEffect(() => {
    const unSubcribe = onSnapshot(collection(db,'notifications'),async (snapshot) => {
      // setLastDoc(null)
      // setHasMore(true)
      const newCount = snapshot.size;
      if(newCount !== countRef.current ){

        countRef.current = newCount
        await fetchData(null)
      }
    })
    return () => unSubcribe()
  },[])

  useEffect(() => {
    const messaging = getMessaging(app)

    generateToken(messaging)
    onMessage(messaging,async (payload) => {
      console.log(payload)

      const {title, body} = payload.notification
      const image = payload.notification.image ?? null

      const data = {title, body, image}

      await fetch(`${self.location.origin}/api/saveNotification`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          title: title,
          body: body,
          image: image
        })
      })

      // setNotify((prev) => [data, ...prev])

    })
    },[])

    const lastNotifyRef = useCallback(node => {
      if(loading || !node ||!(node instanceof Element)) return 
      if(observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && hasMore){
          fetchData(lastDoc)
        }
      },{
        root: scrollContainer.current,
        rootMargin: '0px',
        threshold: 1.0
      })

      observer.current.observe(node)
    },[loading, hasMore, lastDoc])

  return (
    <>
      <button onClick={() => setShow(!show)} className="notify-btn">
        <div className="icon-wrapper">
          <MdNotificationsActive className="icon"/>
          {!show && <span className="badge ">{unReadNotify > 99? '99+' : unReadNotify}</span>}
        </div>
        {show && notify.length === 0 && <div className="spinner end"></div>}
      </button>

      {show && notify.length > 0 && <NotificationList notify={notify} setNotify={setNotify}
      lastNotifyRef={lastNotifyRef} ref={scrollContainer} setUnReadNotify={setUnReadNotify} loading={loading}/>}
    </>
  );
}

const generateToken = async (messaging) => {
    const permission = await Notification.requestPermission()

    if(permission ==="granted"){
      const token = await getToken(messaging,{
        vapidKey:process.env.NEXT_PUBLIC_FIREBASE_VAPIDKEY
      })
      console.log(token)
    }
  }
