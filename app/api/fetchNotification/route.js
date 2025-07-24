import { db } from "@/lib/Firebase"
import { collection, getDoc, getDocs, limit, orderBy, query, startAfter, Timestamp } from "firebase/firestore"
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
            limit(4)
        )
    } else{
        q = query(
            collection(db,'notifications'),
            orderBy('createdAt','desc'),
            limit(4)
        )
    }

    const querySnapshot = await getDocs(q)
    const doc = querySnapshot.docs.map((data) => {
        return {
            id: data.id,
            ...data.data()
        }
    })
    
    const newLastDoc = querySnapshot.docs.at(-1).data().createdAt

    return NextResponse.json({
        success:true,
        data:doc,
        lastDoc:newLastDoc
    })
    
}