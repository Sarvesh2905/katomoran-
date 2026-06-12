import { createContext, useState, useEffect } from 'react'
import { getMe } from '../api/auth.js'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const token = sessionStorage.getItem('token')
      if (token) {
        try {
          const { data } = await getMe()
          setUser(data.user)
        } catch {
          sessionStorage.removeItem('token')
        }
      }
      setIsLoading(false)
    }
    init()
  }, [])

  // Called as loginUser(user, token) from login/register pages
  const loginUser = (user, token) => {
    sessionStorage.setItem('token', token)
    setUser(user)
  }

  const logoutUser = () => {
    sessionStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, loginUser, logoutUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}