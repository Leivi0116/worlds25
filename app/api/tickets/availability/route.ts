import { getTicketAvailability } from "@/lib/google-sheets"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const tickets = await getTicketAvailability()
    return NextResponse.json(tickets)
  } catch (error) {
    console.error("[v0] Error fetching ticket availability:", error)
    return NextResponse.json({ error: "Failed to fetch ticket availability" }, { status: 500 })
  }
}
