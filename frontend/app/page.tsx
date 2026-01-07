// frontend/app/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Left from '@/components/Left'; // Note capitalization check (Nextjs is usually case sensitive)
import Map from '@/components/Map';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CAMPUS_DATA } from '@/data/campus'; // Import local JSON

export default function Home() {
  const [activeBuilding, setActiveBuilding] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  // State to control Map movement
  const [flyToCoords, setFlyToCoords] = useState<[number, number] | null>(null);

  // Handle clicking a marker on the map
  const handleMarkerClick = (buildingId: string) => {
    setActiveBuilding(buildingId);
    // Auto-scroll sidebar to this building
    const element = document.getElementById(buildingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle clicking a room in the Sidebar -> Fly Map to location
  const handleRoomClick = (coords: [number, number]) => {
    setFlyToCoords(coords);
  };

  useEffect(() => {
    // Basic User Location (Optional)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPos([position.coords.latitude, position.coords.longitude]);
        },
        (err) => console.warn('Location access denied', err)
      );
    }
  }, []);

  return (
    <main className="flex flex-col sm:flex-row h-screen bg-white overflow-hidden">
      {/* --- SIDEBAR --- */}
      <div className="basis-2/5 h-[45vh] sm:h-full order-last sm:order-first relative flex flex-col shadow-xl z-20">
        {/* Info Button */}
        <div className="absolute top-4 right-4 z-50">
          <Popover>
            <PopoverTrigger className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#0052AC]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </PopoverTrigger>
            <PopoverContent className="bg-[#153B77] border-none text-white w-72 shadow-xl mr-2 p-5">
              <div className="font-bold mb-2 text-white">NUM Atlas Notes:</div>
              <ul className="list-disc pl-4 text-sm space-y-1 text-gray-200">
                <li>Search for room numbers to find buildings.</li>
                <li>Feedback: @irmuun360</li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="h-full w-full bg-white">
          <Left
            data={CAMPUS_DATA}
            activeBuilding={activeBuilding}
            setActiveBuilding={setActiveBuilding}
            onRoomClick={handleRoomClick} // Pass the fly handler
          />
        </ScrollArea>
      </div>

      {/* --- MAP --- */}
      <div className="basis-3/5 h-[55vh] sm:h-screen relative z-10">
        <Map
          data={CAMPUS_DATA}
          handleMarkerClick={handleMarkerClick}
          userPos={userPos}
          flyToLocation={flyToCoords} // Pass the coords to trigger animation
        />
      </div>
    </main>
  );
}
