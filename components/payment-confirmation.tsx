"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PaymentConfirmationProps {
  data: any
  onStartOver: () => void
}

export default function PaymentConfirmation({ data, onStartOver }: PaymentConfirmationProps) {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center ">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block mb-6 ">
             <div className="h-[50px] w-[220px]" 
               style={{
                backgroundImage: "url('/Worlds_Logo_White.png')",
                backgroundSize:"cover",
                }}
              />
          </div>
          <h1 style={{ fontFamily: "Anton" }} className="text-4xl md:text-7xl uppercase text-white mb-2">
            Victory Secured!
          </h1>
          <p className="text-lg text-muted-foreground">Your payment has been submitted for review.</p>
        </div>

        <Card className="border border-border bg-card p-8 mb-8 shadow-md">
          <div className="text-center mb-8 pb-8 border-b border-border">
            <p className="text-sm uppercase tracking-wider mb-2">Confirmation Email</p>
            <p className="text-lg font-semibold ">worlds25manilatickets@rumbleroyale.gg</p>
            <p className="text-xs mt-2">
              You will receive a confirmation email once your payment is verified.
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-6 mb-8">
            <div>
              <p className="text-l uppercase tracking-wider mb-2">Ticket Type</p>
              <p style={{ fontFamily: "Anton" }} className="text-5xl text-white">
                {data.ticket.type}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider mb-2">Quantity</p>
              <p className="text-xl font-semibold text-foreground">
                {data.ticket.quantity} Ticket{data.ticket.quantity > 1 ? "s" : ""}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider mb-2">Total Paid</p>
              <p className="text-3xl font-bold ">₱{data.totalAmount.toLocaleString()}</p>
            </div>

            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wider mb-2">Payment Reference Code</p>
              <code className="text-lg font-bold  font-mono">{data.paymentCode}</code>
            </div>

            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
              <p className="text-lg leading-none uppercase tracking-wider mb-2">Seat</p>
              <code className="text-3xl font-bold  font-mono">{data.seats}</code>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider mb-2">Attendee Name</p>
              <p className="text-lg font-semibold text-foreground">{data.name}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider mb-2">Email</p>
              <p className="text-lg font-semibold text-foreground">{data.email}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider mb-2">Contact Number</p>
              <p className="text-lg font-semibold text-foreground">{data.contact}</p>
            </div>
          </div>

          {/* Claiming Instructions */}
          <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mb-8">
            <p className="text-xs uppercase tracking-wider mb-3">📅 Claiming Schedule</p>
            <ul className="text-sm space-y-2">
              <li>
                <span className=" font-semibold">Early Claim (Recommended):</span> RR STRONGHOLD – Nov
                6–8, 2025, 1:00–7:00 PM
              </li>
              <li>
                <span className=" font-semibold">On-Site Claim:</span> Samsung Hall, SM Aura – Nov 9, 2025
                (Gates open 10:00 AM)
              </li>
            </ul>
          </div>

          {/* Important Notice */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm font-semibold text-destructive mb-2">⚠️ Important</p>
            <ul className="text-xs space-y-1">
              <li>• The email will contain your official Ticket Code and claiming instructions</li>
              <li>• If you don't receive an email within 24 hours, check your Spam/Promotions folder</li>
              <li>• Contact worlds25manilatickets@rumbleroyale.gg and include your Payment Reference Code (PRC)</li>
              <li>• Bring your Ticket Code and a valid ID matching your name on purchase</li>
            </ul>
          </div>
        </Card>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            onClick={onStartOver}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold uppercase tracking-wider px-8 py-6 shadow-md"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
