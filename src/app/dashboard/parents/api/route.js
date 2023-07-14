import { NextResponse } from "next/server";
// import {firestore} from "@/firebase/admin";

export async function GET() {
  // return firestore.collection('users').limit(2).get()
  //   .then((snapshot) => {
  //     if (snapshot.empty) {
  //       return NextResponse.json({ message: 'No matching documents.' })
  //     }
  //     // const lastVisible = snapshot.docs[snapshot.docs.length-1];
  //     // nextPage(lastVisible)
  //     const data = []
  //     snapshot.forEach(doc => {
  //       const id = doc.id
  //       const user = doc.data()
  //       user.id = id
  //       data.push(user)
  //     });
  //     return NextResponse.json({data})
  //   })
  //   .catch((err) => {
  //     console.log('Error getting documents', err);
  //   });
}

function nextPage(lastVisible) {
  // firestore.collection('users').limit(2).startAfter(lastVisible).get()
  //   .then((snapshot) => {
  //     snapshot.forEach(doc => {
  //       const id = doc.id
  //       const user = doc.data()
  //       user.id = id
  //     })
  //   })
}
