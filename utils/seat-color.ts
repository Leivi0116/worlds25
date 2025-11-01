interface Seat {
  type: "standard" | "vip" | "invited"
}

export const getSeatColor = (seat: Seat, isTaken?: boolean): string => {
  if (isTaken) return "bg-gray-600 opacity-60"
  if (seat.type === "vip") return "bg-blue-500"
  if (seat.type === "invited") return "bg-red-500"
  return "bg-gray-300"
}
