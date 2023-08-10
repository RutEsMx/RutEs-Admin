import { NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function POST(request) {
  const cookieStore = cookies()
  const sessionid = cookieStore.get('sessionid')
  if (sessionid) return NextResponse.json({ error: 'Already logged in'})
  const res = await request.json();
  cookieStore.set({
    name: 'sessionid',
    value: res.jwt,
  })
  return NextResponse.json({ message: 'Logged in'})
}

export async function DELETE() {
  const cookieStore = cookies()
  cookieStore.delete('sessionid')
  return NextResponse.json({ message: 'Logged out'})
}
  