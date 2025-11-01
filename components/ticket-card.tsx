import Image from "next/image"
import { Button } from "@/components/ui/button"

interface TicketCardProps {
  tier: string
  image: string
  remaining: number
  description: string
  price: number
  currency: string
}

export default function TicketCard({ tier, image, remaining, description, price, currency }: TicketCardProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Ticket Image */}
      <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden mb-6 flex-shrink-0">
        <Image src={image || "/placeholder.svg"} alt={`${tier} Ticket`} fill className="object-cover" />
      </div>

      {/* Ticket Info */}
      <div className="flex-1 flex flex-col">
        {/* Tier Name and Remaining */}
        <div className="flex items-baseline justify-between mb-4 items-stretch">
          <h2 className="font-black text-white leading-3 text-5xl">{tier}</h2>
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            REMAINING
            <br />
            <span className="text-sm text-gray-300 font-semibold">{remaining.toLocaleString()} LEFT</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-6 flex-1">{description}</p>

        {/* Price */}
        <div className="mb-6">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">PRICE:</div>
          <div className="text-4xl font-black text-white">
            {price.toLocaleString()}
            <span className="text-lg ml-2">{currency}</span>
          </div>
        </div>

        {/* Buy Button */}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 uppercase tracking-wider rounded-none">
          Buy Tickets
        </Button>
      </div>
    </div>
  )
}
