import { addSubmissionToSheet, updateTicketSoldCount } from "@/lib/google-sheets"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("[v0] Submission received:", {
      name: body.name,
      ticketType: body.ticket.type,
      seats: body.seats,
      selectedSeatsString: body.seats,
    })

    await addSubmissionToSheet(undefined, {
      name: body.name,
      email: body.email,
      contact: body.contact,
      ticketType: body.ticket.type,
      quantity: body.ticket.quantity,
      totalAmount: body.totalAmount,
      paymentCode: body.paymentCode,
      timestamp: body.timestamp,
      selectedSeats: body.seats, 
      fileUrl: body.fileUrl,
    })

    console.log("[v0] Submission added to sheet successfully")

    await updateTicketSoldCount(undefined, body.ticket.type, body.ticket.quantity)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error processing submission:", error)
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 })
  }
}
