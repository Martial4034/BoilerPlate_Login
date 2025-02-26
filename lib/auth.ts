import { cookies } from "next/headers"
import { adminAuth } from "./firebase-admin"

export async function getAuthUser() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    
    if (!sessionCookie?.value) {
      return null
    }

    // Vérifier le token avec Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(sessionCookie.value)
    return decodedToken
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getAuthUser()
  
  if (!user) {
    throw new Error("Authentication required")
  }
  
  return user
} 