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
  const [checking, setChecking] = useState<string | null>(null)
  const router = useRouter()

  // Function to load or refresh tickets
  const fetchTickets = async () => {
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
  }

  // Initial load
  useEffect(() => {
    fetchTickets()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // ✅ Auto-refresh availability every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/tickets/availability")
        if (!res.ok) return

        const data = await res.json()

        setTickets((prevTickets) =>
          prevTickets.map((t) => {
            const updated = data.find((d: any) => d.type === t.type)
            return updated ? { ...t, available: updated.available } : t
          })
        )
      } catch (err) {
        console.warn("Failed to refresh ticket availability:", err)
      }
    }, 1000) 

    return () => clearInterval(interval)
  }, [])

  const handleSelectTicket = async (ticket: Ticket) => {
    setChecking(ticket.id)
    try {
      const res = await fetch("/api/tickets/availability")
      const latest = await res.json()
      const fresh = latest.find((t: any) => t.type === ticket.type)

      if (!fresh || fresh.available <= 0) {
        alert(`Sorry, ${ticket.type} tickets are sold out now.`)
        await fetchTickets()
        return
      }

      onSelectTicket({
        id: ticket.id,
        type: ticket.type,
        price: ticket.price,
        quantity: 1,
      })
    } catch {
      alert("Failed to verify ticket availability. Please try again.")
    } finally {
      setChecking(null)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Summoning your Tickets...</p>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-[#1F1F1F] p-4 md:p-8">
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="bg-[#1F1F1F] overflow-hidden">
            <div className="relative h-72 md:h-96 overflow-hidden bg-muted">
              <img
                src={TICKET_IMAGES[ticket.type] || "/placeholder.svg"}
                alt={ticket.type}
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>

            <div className="p-4 space-y-4">
              <h3 style={{ fontFamily: "Anton" }} className="text-6xl text-white uppercase mb-2">
                {ticket.type}
              </h3>
              <p className="text-gray-300 text-sm">
                REMAINING
                <br />
                <span className={`text-2xl ${ticket.available === 0 ? "text-red-500" : "text-white"}`}>
                  {ticket.available === 0 ? "SOLD OUT" : `${ticket.available} LEFT`}
                </span>
              </p>

              <p className="text-sm text-gray-200">{ticket.description}</p>

              <div className="pt-4 border-t border-border">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl text-white">₱{ticket.price}</span>
                  <span className="text-gray-400">per ticket</span>
                </div>
              </div>

              <Button
                onClick={() => handleSelectTicket(ticket)}
                disabled={ticket.available === 0 || checking === ticket.id}
                className="w-full bg-blue-600 text-white uppercase h-12 text-lg tracking-wider hover:bg-transparent hover:border transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {checking === ticket.id ? "Checking..." : ticket.available === 0 ? "SOLD OUT" : "BUY TICKETS"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="center mt-8 text-gray-400 text-sm">
        <p>© All rights reserved RUMBLE ROYALE</p>
      </div>
    </div>
  )
}
