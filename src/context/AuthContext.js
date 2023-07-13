'use client'
import { createContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
} from 'firebase/auth'
import {
  auth,
} from '@/firebase/client'
import { useContext } from 'react'
import { getDocumentByField } from '@/firebase/crud'

export const AuthContext = createContext()

export const useAuthContext = () => useContext(AuthContext)

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const profile = await getDocumentByField('profile', 'id', user?.uid)
      setUser(user)
      setProfile(profile)
      setLoading(false)
      
    })
    
    return () => unsubscribe()
  }, [])
  
  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}