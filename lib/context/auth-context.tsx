import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Obtenir le token et le stocker dans un cookie
        const token = await user.getIdToken()
        document.cookie = `session=${token}; path=/;`
      } else {
        // Supprimer le cookie de session
        document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 