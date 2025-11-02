import { getTicketAvailability } from "@/lib/google-sheets"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const tickets = await getTicketAvailability()
    return NextResponse.json(tickets)
  } catch (error) {
    console.error(" Error fetching ticket availability:", error)
    return NextResponse.json({ error: "Stay Calm Summoner. Try to reload the page." }, { status: 500 })
  }
}
