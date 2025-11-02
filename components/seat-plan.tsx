"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getSeatColor } from "@/utils/seat-color"

interface SeatPlanProps {
  ticketType: string
  quantity: number
  onConfirm: (seats: string[]) => void
  onBack: () => void
}

interface Seat {
  id: string
  row: string
  number: number
  type: "standard" | "vip" | "invited"
  floor: "ground" | "second"
}

const generateSeats = (): Seat[] => {
  const seats: Seat[] = []

  // Ground Floor rows J–Q with VIP sections
  const groundFloorRows = [
    { row: "Q", standard: 0, vip: 21, invited: 0 },
    { row: "P", standard: 0, vip: 21, invited: 0 },
    { row: "O", standard: 0, vip: 21, invited: 0 },
    { row: "N", standard: 0, vip: 21, invited: 0 },
    { row: "M", standard: 0, vip: 21, invited: 0 },
    { row: "L", standard: 0, vip: 21, invited: 0 },
    { row: "K", standard: 0, vip: 21, invited: 0 },
    { row: "J", standard: 0, vip: 21, invited: 0 },
    { row: "I", standard: 0, vip: 21, invited: 0 },
    { row: "H", standard: 0, vip: 21, invited: 0 },
    { row: "G", standard: 0, vip: 21, invited: 0 },
    { row: "F", standard: 0, vip: 21, invited: 0 },
  ]

  groundFloorRows.forEach((rowData) => {
    let seatNum = 12

    for (let i = 0; i < (rowData.standard || 0); i++) {
      seats.push({
        id: `${rowData.row}${seatNum}`,
        row: rowData.row,
        number: seatNum,
        type: "standard",
        floor: "ground",
      })
      seatNum++
    }

    for (let i = 0; i < (rowData.vip || 0); i++) {
      seats.push({
        id: `${rowData.row}${seatNum}`,
        row: rowData.row,
        number: seatNum,
        type: "vip",
        floor: "ground",
      })
      seatNum++
    }

    for (let i = 0; i < (rowData.invited || 0); i++) {
      seats.push({
        id: `${rowData.row}${seatNum}`,
        row: rowData.row,
        number: seatNum,
        type: "invited",
        floor: "ground",
      })
      seatNum++
    }
  })

  return seats
}

const ALL_SEATS = generateSeats()

export default function SeatPlan({ ticketType, quantity, onConfirm, onBack }: SeatPlanProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [filterType, setFilterType] = useState<"standard" | "vip">("standard")
  const [bookedSeats, setBookedSeats] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // 🔁 Real-time booked seats updater (1-second interval)
  useEffect(() => {
    let isMounted = true

    const fetchBookedSeats = async () => {
      try {
        const response = await fetch("/api/tickets/booked", { cache: "no-store" })
        const data = await response.json()
        if (isMounted) {
          setBookedSeats(new Set(data.bookedSeats || []))
          setLoading(false)
        }
      } catch (error) {
        console.error("[v0] Error fetching booked seats:", error)
      }
    }

    // Initial fetch
    fetchBookedSeats()

    // Auto-refresh every 1 second
    const interval = setInterval(fetchBookedSeats, 1000)

    // Cleanup
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    setFilterType(ticketType === "VIP" ? "vip" : "standard")
    setSelectedSeats([])
  }, [ticketType])

  const handleSeatClick = (seat: Seat) => {
    if (bookedSeats.has(seat.id)) return
    if (seat.type !== "vip") return

    setSelectedSeats((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((s) => s !== seat.id)
      } else if (prev.length < quantity) {
        return [...prev, seat.id]
      }
      return prev
    })
  }

  const getSeatOpacity = (seat: Seat): string => {
    if (seat.type !== "vip") return "opacity-10 pointer-events-none"
    return "opacity-100"
  }

  const seatsByFloor = (floor: "ground" | "second") => {
    return ALL_SEATS.filter((s) => s.floor === floor).reduce(
      (acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = []
        acc[seat.row].push(seat)
        return acc
      },
      {} as Record<string, Seat[]>,
    )
  }

  const renderFloor = (floor: "ground" | "second", title: string, rows: string[]) => (
    <div className="mb-12">
      <h2 style={{ fontFamily: "Anton" }} className="text-3xl text-primary mb-6 text-center">
        {title}
      </h2>

      <div className="flex flex-col gap-3 px-4">
        {rows.map((row) => {
          const seatsByRow = seatsByFloor(floor)
          const seatsInRow = (seatsByRow[row] || []).sort((a, b) => a.number - b.number)

          return (
            <div key={row} className="flex items-center gap-4 justify-center">
              <span className="font-semibold text-muted-foreground w-6 text-right text-sm">{row}</span>
              <div className="flex gap-1">
                {seatsInRow.map((seat) => {
                  const isSelected = selectedSeats.includes(seat.id)
                  const isTaken = bookedSeats.has(seat.id)
                  const isClickable =
                    !isTaken &&
                    ((filterType === "standard" && seat.type === "standard") ||
                      (filterType === "vip" && seat.type === "vip"))

                  return (
                    <div key={seat.id} className="relative group transition-opacity duration-300">
                      <button
                        onClick={() => isClickable && handleSeatClick(seat)}
                        disabled={!isClickable}
                        className={`
                          md:w-6 md:h-6 w-3 h-3 transition-all duration-300 transform
                          ${getSeatColor(seat, isTaken)}
                          ${getSeatOpacity(seat)}
                          ${isSelected ? "scale-125 ring-2 ring-primary ring-offset-1" : ""}
                          ${isClickable && !isSelected ? "hover:scale-110 cursor-pointer" : ""}
                          ${isTaken ? "cursor-not-allowed opacity-50" : ""}
                        `}
                        title={isTaken ? "Seat taken" : `Seat ${seat.id}`}
                        onMouseEnter={() => isTaken && setHoveredSeat(seat.id)}
                        onMouseLeave={() => setHoveredSeat(null)}
                      />
                      {isTaken && hoveredSeat === seat.id && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap pointer-events-none z-10">
                          Seat taken
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: "Anton" }} className="text-5xl md:text-6xl text-primary mb-2 text-balance">
            SELECT VIP SEATS
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Choose {quantity} {quantity === 1 ? "seat" : "seats"} for your {ticketType} ticket
          </p>
        </div>

        {/* Updating indicator */}
        {!loading && (
          <p className="text-center text-xs text-muted-foreground mb-3 animate-pulse">
            Updating seat availability...
          </p>
        )}

        {/* Legend */}
        <Card className="flex items-center flex-col mb-8 bg-transparent border-0 shadow-none">
          <div className="inset-0 opacity-100 w-[50%] mb-6">
            <img src="/seats.png" alt="" className="w-full h-[10%] object-contain" />
          </div>
        </Card>
        <div className="flex flex-wrap gap-6 justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded opacity-60"></div>
            <span className="text-sm text-muted-foreground">Taken</span>
          </div>
        </div>

        <Card className="border border-border bg-card p-8 mb-8 ">
          {!loading ? (
            renderFloor("ground", "VIP SEATS AVAILABLE", ["Q", "P", "O", "N", "M", "L", "K", "J", "I", "H", "G", "F"])
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading seat availability...</p>
            </div>
          )}
        </Card>

        {/* Selection Summary and Buttons */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="border border-border bg-card p-6">
              <h3 style={{ fontFamily: "Anton" }} className="text-xl text-primary mb-4">
                SELECTED SEATS ({selectedSeats.length}/{quantity})
              </h3>
              {selectedSeats.length === 0 ? (
                <p className="text-muted-foreground">
                  Select {quantity} {quantity === 1 ? "seat" : "seats"} to continue
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seatId) => (
                    <span
                      key={seatId}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {seatId}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => onConfirm(selectedSeats)}
              disabled={selectedSeats.length !== quantity}
              className="w-full bg-primary text-white hover:bg-primary/90 font-semibold uppercase tracking-wider h-12"
            >
              Confirm Seats
            </Button>
            <Button onClick={onBack} variant="outline" className="w-full bg-transparent">
              Back to Tickets
            </Button>
          </div>
        </div>
      </div>

      <div className="center m-8">
        <p>© All rights reserved RUMBLE ROYALE | L E 1 V I</p>
      </div>
    </div>
  )
}
