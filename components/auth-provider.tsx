"use client"

import { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
  user: any | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Simplified AuthProvider that doesn't do anything for now since Supabase is gone
  // In a real scenario, you'd integrate Sanity auth or another provider here
  return (
    <AuthContext.Provider value={{ user: null, loading: false }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
