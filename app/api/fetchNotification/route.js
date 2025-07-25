import { db } from "@/lib/Firebase"
import { collection, getDoc, getDocs, limit, orderBy, query, startAfter, Timestamp, where } from "firebase/firestore"
import { NextResponse } from "next/server"

export async function POST(req) {
    const request = await req.json()

    const {lastDoc} = request

    let q
    if(lastDoc != null){
        const timestamp = new Timestamp(lastDoc.seconds, lastDoc.nanoseconds)
        q = query(
            collection(db,'notifications'),
            orderBy('createdAt','desc'),
            startAfter(timestamp),
            limit(5)
        )
    } else{
        q = query(
            collection(db,'notifications'),
            orderBy('createdAt','desc'),
            limit(5)
        )
    }

    const querySnapshot = await getDocs(q)
    let doc = querySnapshot.docs.map((data) => {
        return {
            id: data.id,
            ...data.data()
        }
    })
    let hasMore = false
    if(doc.length === 5){
        hasMore = true
        doc = doc.slice(0,4)
    }

    const newLastDoc = doc.at(-1).createdAt

    const unRead = query(
        collection(db,'notifications'),
        where('read','==',false)
    )
    const queryUnReadSnapshot = await getDocs(unRead)
    const unReadNoti = queryUnReadSnapshot.docs.length

    return NextResponse.json({
        success:true,
        data:doc,
        lastDoc:newLastDoc,
        unReadNoti: unReadNoti,
        hasMore: hasMore
    })
    
}