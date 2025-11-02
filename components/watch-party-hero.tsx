"use client"

import { Button } from "@/components/ui/button"

interface WatchPartyHeroProps {
  onContinue: () => void
}

export default function WatchPartyHero({ onContinue }: WatchPartyHeroProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100"
        style={{
          backgroundImage: "url('/home.png')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 " />

      {/* Content container */}
      <div className="relative z-10 flex min-h-screen w-[100%] items-center justify-center">
        <div className="w-[90%] px-6 sm:px-12 lg:px-20 ">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left side - Text content */}
            <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
              <div className="h-[50px] w-[220px]" 
               style={{
                backgroundImage: "url('/Worlds_Logo_White.png')",
                backgroundSize:"cover",
                }}
              />

              <div className="space-y-2">
                <h1 className="font-anton text-[140px] sm:text-[100px] lg:text-[200px] leading-none text-white">
                  WATCH
                </h1>
                <h1 className="font-anton text-[140px] sm:text-[100px] lg:text-[200px] leading-none text-white  ">
                  PARTY
                </h1>
              </div>

              <div className="space-y-2 text-white/90 font-montserrat">
                <p className="text-base leading-none sm:text-lg">Samsung Hall, SM Aura, BGC</p>
                <p className="text-base leading-none sm:text-lg font-semibold">November 9, 2025 | 2:00 PM</p>
                <p className="text-base leading-none sm:text-lg font-semibold">LIMITED SEATS AVAILABLE</p>
              </div>
              

              <div className="pt-4">


                <p>Thank you for your excitement, Summoners! <br />The official ticket selling will be announced soon on the official League of Legends Philippines social media pages</p>


                {/* 
                <Button
                  onClick={onContinue}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-7 text-lg rounded-none"
                >
                  BUY TICKETS
                </Button> 
                 */}
              </div>
              <div className="center mt-8">
           <p>© All rights reserved RUMBLE ROYALE</p>
         </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    
  )
  
}
