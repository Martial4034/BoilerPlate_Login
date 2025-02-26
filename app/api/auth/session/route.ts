import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()
    
    // Créer un cookie de session qui expire dans 5 jours
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
    
    const response = NextResponse.json({ success: true })
    response.cookies.set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
    
    return response
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("session")
  return response
} 