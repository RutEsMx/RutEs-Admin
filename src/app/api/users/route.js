import { auth } from 'firebase-admin'
import { NextResponse } from 'next/server'
import { customInitApp } from '@/firebase/admin'

// Init the Firebase SDK every time the server is called
customInitApp()

export async function POST(request) { 
  const res = await request.json()
  const { email, password } = res
  try {
    const response = await auth().createUser({
      email: email,
      password: password,
    })
    return NextResponse.json({ success: true, message: 'Usuario creado', result: response })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  
  return new Response('GET request')
}