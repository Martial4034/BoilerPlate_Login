import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const user = await requireAuth()
    
    return NextResponse.json({
      message: "Route protégée",
      user: user
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    )
  }
} 