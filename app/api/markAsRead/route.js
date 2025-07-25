import { db } from "@/lib/Firebase"
import { collection, doc, getDoc, query, updateDoc, where } from "firebase/firestore"
import { NextResponse } from "next/server"

export async function POST(req) {
    const request = await req.json()
    const {id} = request

    const docRef = doc(db,'notifications',id)
    await updateDoc(docRef,{read: true})

    return NextResponse.json({
        success: true,
    })
}