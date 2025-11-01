"use client"

import { useState, useEffect } from "react"
import TicketSelection from "@/components/ticket-selection"
import SeatPlan from "@/components/seat-plan"
import TicketForm from "@/components/ticket-form"
import PaymentConfirmation from "@/components/payment-confirmation"
import WatchPartyHero from "@/components/watch-party-hero"

type Step = "hero" | "selection" | "seats" | "form" | "confirmation"

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("hero")
  const [selectedTicket, setSelectedTicket] = useState<{
    type: string
    price: number
    quantity: number
  } | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [confirmationData, setConfirmationData] = useState<any>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

  const handleSelectTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setSelectedSeats([])
    // REGULAR tickets go directly to the form
    if (ticket.type === "VIP" || ticket.type === "ULTRA VIP") {
      setCurrentStep("seats")
    } else {
      setCurrentStep("form")
    }
  }

  const handleSeatsConfirm = (seats: string[]) => {
    setSelectedSeats(seats)
    setCurrentStep("form")
  }

  const handleFormSubmit = (data: any) => {
    setConfirmationData(data)
    setCurrentStep("confirmation")
  }

  const handleBackToSelection = () => {
    setCurrentStep("selection")
    setSelectedTicket(null)
    setSelectedSeats([])
  }

  const handleBackToSeats = () => {
    setCurrentStep("seats")
  }

  const handleStartOver = () => {
    setCurrentStep("hero")
    setSelectedTicket(null)
    setSelectedSeats([])
    setConfirmationData(null)
  }

  const handleBackToForm = () => {
    if (selectedTicket?.type === "VIP") {
      setCurrentStep("seats")
    } else {
      setCurrentStep("selection")
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {currentStep === "hero" && <WatchPartyHero onContinue={() => setCurrentStep("selection")} />}
      {currentStep === "selection" && <TicketSelection onSelectTicket={handleSelectTicket} />}
      {currentStep === "seats" && selectedTicket && (
        <SeatPlan
          ticketType={selectedTicket.type}
          quantity={selectedTicket.quantity}
          onConfirm={handleSeatsConfirm}
          onBack={handleBackToSelection}
        />
      )}
      {currentStep === "form" && selectedTicket && (
        <TicketForm
          ticket={selectedTicket}
          seats={selectedSeats}
          onSubmit={handleFormSubmit}
          onBack={handleBackToForm}
        />
      )}
      {currentStep === "confirmation" && confirmationData && (
        <PaymentConfirmation data={confirmationData} onStartOver={handleStartOver} />
      )}
    </main>
  )
}
