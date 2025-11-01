"use client"

import { Button } from "@/components/ui/button"

interface EventPosterProps {
  onContinue: () => void
}

export default function EventPoster({ onContinue }: EventPosterProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-16">
          <div className="mb-8 flex justify-center">
            <div className="fade-in">
              <img
                src="/league-of-legends-worlds-2025-trophy-crystal-blue-.jpg"
                alt="Worlds 2025 Trophy"
                className="h-48 w-48 object-contain"
              />
            </div>
          </div>
          <h1 style={{ fontFamily: "Anton" }} className="text-6xl md:text-7xl font-bold text-primary mb-2">
            WORLDS 2025
          </h1>
          <p className="text-xl font-semibold text-secondary mb-2 tracking-widest">CHAMPIONSHIP FINALS</p>
          <p className="text-lg text-muted-foreground">League of Legends Global Championship</p>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden mb-8 shadow-lg">
          <div
            className="relative w-full bg-gradient-to-br from-muted to-background flex items-center justify-center p-8"
            style={{ aspectRatio: "16/9" }}
          >
            <div className="text-center">
              <div className="text-6xl font-bold text-secondary/30 mb-4">⚔️</div>
              <h2 style={{ fontFamily: "Anton" }} className="text-4xl md:text-5xl font-bold text-primary mb-4">
                WATCH PARTY
              </h2>
              <p className="text-lg font-semibold text-foreground mb-2">Samsung Hall, SM Aura, BGC</p>
              <p className="text-base text-muted-foreground mb-4">📅 November 9, 2025 | ⏰ 2:00 PM</p>
              <div className="inline-block px-4 py-2 bg-secondary/10 border border-secondary/30 rounded">
                <p className="text-sm text-secondary font-semibold">🎮 LIMITED SEATS AVAILABLE</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-8">
          <p className="text-sm font-semibold text-destructive mb-2">⚠️ Official Ticketing Website</p>
          <p className="text-sm text-foreground/80">
            Tickets are sold only at <span className="font-semibold text-primary">rumbleroyale.gg/worlds25</span>.
            Payments accepted only through the official RUMBLE ROYALE GCash and Bank accounts shown on this site.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onContinue}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-12 py-6 font-semibold uppercase tracking-wider shadow-md transition-all duration-300"
          >
            🎟️ Claim Your Seat
          </Button>
        </div>
      </div>
    </div>
  )
}
