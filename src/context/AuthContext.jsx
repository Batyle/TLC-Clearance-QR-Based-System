import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const SESSION_KEY = 'tlc-clearance-user'

// Replace these records with an API request once the database is available.
const sampleUsers = [
  { email: 'student@tlc.edu', password: 'student123', userId: '2024-0001', name: 'Alex Student', role: 'student' },
  { email: 'staff@tlc.edu', password: 'staff123', userId: 'STF-001', name: 'Jordan Staff', role: 'staff', office: 'Registrar Office' },
]

function getStoredUser() {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const login = (email, password) => {
    const account = sampleUsers.find((sampleUser) => sampleUser.email.toLowerCase() === email.toLowerCase() && sampleUser.password === password)
    if (!account) return { success: false, message: 'The email or password is incorrect.' }
    const { email: _email, password: _password, ...userData } = account
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData))
    setUser(userData)
    return { success: true, user: userData }
  }
  const logout = () => { localStorage.removeItem(SESSION_KEY); setUser(null) }
  const value = useMemo(() => ({ user, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider.')
  return context
}
