"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface Ticket {
  id: string
  type: string
  price: number
  description: string
  available: number
  quantity: number
}

interface TicketSelectionProps {
  onSelectTicket: (ticket: { type: string; price: number; quantity: number; id: string }) => void
}

const TICKET_DESCRIPTIONS: Record<string, string> = {
  REGULAR:
    "Access to Monster Energy Drink, Sticker Set, Balloon Clapper, Poro Keychain, Foil Ticket, Tyvec, and Raffle Entry",
  VIP: "Access to Monster Energy Drink, Sticker Set, Balloon Clapper, Poro Keychain, Foil Ticket, Tyvec, and Raffle Entry + Shirt",
 
}

const TICKET_PRICES: Record<string, number> = {
  REGULAR: 499,
  VIP: 999,

}

const TICKET_IMAGES: Record<string, string> = {
  REGULAR: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PCqjQ92yNICf5mphCu8Nrfi6IL3it6.png",
  VIP: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0p9EUBLz7ov1gEAqobobC0xJcg4Rsj.png",

}

export default function TicketSelection({ onSelectTicket }: TicketSelectionProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets/availability")
        if (!res.ok) throw new Error("Failed to fetch tickets")
        const data = await res.json()

        const formatted = data.map((t: any, idx: number) => ({
          ...t,
          id: `ticket-${idx}`,
          description: TICKET_DESCRIPTIONS[t.type] || "",
          price: TICKET_PRICES[t.type] || t.price,
          quantity: 1,
        }))

        setTickets(formatted)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tickets")
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const handleSelectTicket = (ticket: Ticket) => {
    if (ticket.available <= 0) return

    // REGULAR tickets skip seat selection and go directly to form
    if (ticket.type === "VIP" || ticket.type === "ULTRA VIP") {
      onSelectTicket({
        id: ticket.id,
        type: ticket.type,
        price: ticket.price,
        quantity: 1,
      })
    } else if (ticket.type === "REGULAR") {
      onSelectTicket({
        id: ticket.id,
        type: ticket.type,
        price: ticket.price,
        quantity: 1,
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Summoning your tickets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] p-4 md:p-8">
      <div className="absolute inset-0 opacity-100">
        <img src="/ticket-header.png" alt="" className="w-full h-[70%] object-cover" />
      </div>

      <div className="text-center mb-16 my-[150px] relative w-full">
        <h1 style={{ fontFamily: "Anton" }} className="text-[150px] leading-none  text-white mb-8">
          WATCH PARTY
        </h1>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12 py-10">
          {[
            ["LOL", "ESPORTS"],
            ["WATCH PARTY &", "MINI FAN FEST"],
            ["MEET AND", "GREETS"],
            ["EXCLUSIVE", "MERCH"],
            ["NOVEMBER", "9TH"],
            ["EARN YOUR", "LEGACY"],
          ].map(([line1, line2], i) => (
            <div key={i} className="text-left">
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                {line1}
              </p>
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                {line2}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="bg-[#1F1F1F] overflow-hidden">
            <div className="relative h-72 md:h-96 overflow-hidden bg-muted">
              <img
                src={TICKET_IMAGES[ticket.type] || "/placeholder.svg"}
                alt={ticket.type}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="p-4 space-y-4">
              <div>
                <h3 style={{ fontFamily: "Anton" }} className="text-6xl text-white uppercase mb-2">
                  {ticket.type}
                </h3>
                <p className="text-sm text-gray-300 py-2">
                  REMAINING
                  <br />
                  <p className="text-2xl">
                  <span
                    className={ticket.available === 0 ? "text-red-500" : "text-white"}>
                    {ticket.available === 0 ? "SOLD OUT" : `${ticket.available} LEFT`}
                  </span>
                  </p>
                </p>
              </div>

              <p className="text-sm text-gray-200 leading-relaxed">{ticket.description}</p>

              <div className="pt-4 border-t border-border">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl text-white">₱{ticket.price}</span>
                  <span className="text-gray-400">per ticket</span>
                </div>
              </div>

              <Button
                onClick={() => handleSelectTicket(ticket)}
                disabled={ticket.available === 0}
                className="w-full bg-blue-600 text-white hover:bg-transparent hover:border uppercase tracking-wider h-12 text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {ticket.available === 0 ? "SOLD OUT" : "BUY TICKETS"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
